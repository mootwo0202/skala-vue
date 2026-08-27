<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import { findStadium } from '@/data/baseballData'

const PARSE_API_URL =
  'https://api.parse.bot/scraper/91af86ff-58ff-41cd-98e1-26887b18cb09/get_schedule'
const PARSE_API_KEY = import.meta.env.VITE_PARSE_API_KEY
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

const configStore = useConfigStore()
const isLoading = ref(false)
const games = ref([])
const loadError = ref('')
const detailVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const selectedGame = ref(null)
const currentWeather = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const forecastCache = new Map()

const getKoreaToday = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const getPart = (type) => parts.find((part) => part.type === type)?.value
  const year = getPart('year')
  const month = getPart('month')
  const day = getPart('day')

  return {
    year,
    month,
    day,
    isoDate: `${year}-${month}-${day}`,
  }
}

const today = getKoreaToday()
const todayLabel = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
}).format(new Date())

const aqiInfo = computed(() => {
  const levels = {
    1: { label: '좋음', className: 'good' },
    2: { label: '양호', className: 'fair' },
    3: { label: '보통', className: 'moderate' },
    4: { label: '나쁨', className: 'poor' },
    5: { label: '매우 나쁨', className: 'very-poor' },
  }
  return levels[airQuality.value?.aqi] ?? { label: '확인 불가', className: 'unknown' }
})

const displayCurrentTemp = computed(() => convertTemperature(currentWeather.value?.temp))
const displayFeelsLike = computed(() => convertTemperature(currentWeather.value?.feelsLike))

const convertTemperature = (temperature) => {
  if (temperature === null || temperature === undefined) return '-'
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }
  return Math.round(temperature)
}

const formatForecastTime = (timestamp, timezoneOffset) => {
  const stadiumTime = new Date((timestamp + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(stadiumTime)
}

const isTodayGame = (dateText) => {
  const match = String(dateText ?? '').match(/(\d{1,2})\.(\d{1,2})/)
  if (!match) return false
  return Number(match[1]) === Number(today.month) && Number(match[2]) === Number(today.day)
}

const getMonthlySchedule = async () => {
  const cacheKey = `kbo-schedule-${today.isoDate}`
  const cachedSchedule = localStorage.getItem(cacheKey)
  if (cachedSchedule) {
    try {
      return JSON.parse(cachedSchedule)
    } catch (error) {
      console.warn('저장된 KBO 일정 캐시를 읽지 못했습니다.', error)
      localStorage.removeItem(cacheKey)
    }
  }

  const response = await axios.post(
    PARSE_API_URL,
    { year: today.year, month: today.month },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PARSE_API_KEY,
      },
    },
  )
  const schedule = response.data?.data?.games ?? response.data?.games ?? []
  localStorage.setItem(cacheKey, JSON.stringify(schedule))
  return schedule
}

const calculatePlayability = (weather, stadium) => {
  if (stadium.isDome) {
    return {
      score: 98,
      label: '경기 진행 유력',
      tagType: 'success',
      reasons: ['돔구장은 외부 강수의 영향을 거의 받지 않습니다.'],
    }
  }

  let score = 100
  const reasons = []

  if (weather.rainProbability >= 80) {
    score -= 40
    reasons.push('강수 확률이 매우 높습니다.')
  } else if (weather.rainProbability >= 60) {
    score -= 25
    reasons.push('강수 가능성이 높습니다.')
  } else if (weather.rainProbability >= 30) {
    score -= 10
    reasons.push('비가 올 가능성이 있습니다.')
  }

  if (weather.rainfall >= 10) {
    score -= 40
    reasons.push('예상 강수량이 많습니다.')
  } else if (weather.rainfall >= 5) {
    score -= 25
    reasons.push('경기 시간대에 강한 비가 예상됩니다.')
  } else if (weather.rainfall >= 1) {
    score -= 10
    reasons.push('약한 비가 예상됩니다.')
  }

  if (weather.weatherId >= 200 && weather.weatherId < 300) {
    score -= 35
    reasons.push('천둥·번개 예보가 있습니다.')
  }

  if (weather.windSpeed >= 14) {
    score -= 30
    reasons.push('강풍으로 경기 운영이 어려울 수 있습니다.')
  } else if (weather.windSpeed >= 10) {
    score -= 15
    reasons.push('바람이 강하게 불 수 있습니다.')
  }

  if (weather.temp >= 35 || weather.temp <= 0) {
    score -= 10
    reasons.push('기온이 경기하기에 좋지 않습니다.')
  }

  score = Math.min(99, Math.max(5, score))
  if (!reasons.length) reasons.push('경기에 큰 영향을 줄 기상 요소가 적습니다.')

  if (score >= 80) {
    return { score, label: '진행 가능성 높음', tagType: 'success', reasons }
  }
  if (score >= 60) {
    return { score, label: '진행 가능', tagType: 'primary', reasons }
  }
  if (score >= 40) {
    return { score, label: '경기 진행 주의', tagType: 'warning', reasons }
  }
  return { score, label: '취소 가능성 높음', tagType: 'danger', reasons }
}

const getGameForecast = async (game, stadium) => {
  let forecastData = forecastCache.get(stadium.id)
  if (!forecastData) {
    const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        lat: stadium.lat,
        lon: stadium.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })
    forecastData = response.data
    forecastCache.set(stadium.id, forecastData)
  }

  const gameTime = Date.parse(`${today.isoDate}T${game.time || '18:30'}:00+09:00`) / 1000
  const nearestForecast = forecastData.list.reduce((nearest, forecast) => {
    if (!nearest) return forecast
    return Math.abs(forecast.dt - gameTime) < Math.abs(nearest.dt - gameTime) ? forecast : nearest
  }, null)

  return {
    temp: nearestForecast.main.temp,
    status: nearestForecast.weather[0].description,
    weatherId: nearestForecast.weather[0].id,
    rainProbability: Math.round(nearestForecast.pop * 100),
    rainfall: nearestForecast.rain?.['3h'] ?? 0,
    windSpeed: nearestForecast.wind.speed,
  }
}

const makeGameCard = async (game, index) => {
  const stadium = findStadium(game.stadium)
  if (!stadium) return null

  const baseCard = {
    id: `${today.isoDate}-${stadium.id}-${index}`,
    game,
    stadium,
    weather: null,
    playability: null,
    weatherError: '',
  }

  try {
    const weather = await getGameForecast(game, stadium)
    return {
      ...baseCard,
      weather,
      playability: calculatePlayability(weather, stadium),
    }
  } catch (error) {
    console.error(`${stadium.name} 예보를 불러오지 못했습니다.`, error)
    return { ...baseCard, weatherError: '구장 예보를 불러오지 못했습니다.' }
  }
}

const loadTodayGames = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const schedule = await getMonthlySchedule()
    const todaySchedule = schedule.filter((game) => isTodayGame(game.date))
    const gameCards = await Promise.all(
      todaySchedule.map((game, index) => makeGameCard(game, index)),
    )
    games.value = gameCards.filter(Boolean)
  } catch (error) {
    console.error('오늘의 야구 날씨를 구성하지 못했습니다.', error)
    loadError.value = '경기와 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

const progressStatus = (score) => {
  if (score >= 80) return 'success'
  if (score < 40) return 'exception'
  return undefined
}

const openDetail = async (gameCard) => {
  selectedGame.value = gameCard
  detailVisible.value = true
  detailLoading.value = true
  detailError.value = ''
  currentWeather.value = null
  forecastList.value = []
  airQuality.value = null

  try {
    const { lat, lon, id } = gameCard.stadium
    const [currentResponse, airPollutionResponse] = await Promise.all([
      axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric', lang: 'kr' },
      }),
      axios.get(`${WEATHER_BASE_URL}/air_pollution`, {
        params: { lat, lon, appid: OPENWEATHER_API_KEY },
      }),
    ])

    let forecastData = forecastCache.get(id)
    if (!forecastData) {
      const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric', lang: 'kr' },
      })
      forecastData = forecastResponse.data
      forecastCache.set(id, forecastData)
    }

    const raw = currentResponse.data
    currentWeather.value = {
      temp: raw.main.temp,
      feelsLike: raw.main.feels_like,
      status: raw.weather[0].description,
      humidity: raw.main.humidity,
      wind: raw.wind.speed,
      rainfall: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
    }

    const timezoneOffset = forecastData.city.timezone
    forecastList.value = forecastData.list.slice(0, 8).map((forecast) => ({
      timestamp: forecast.dt,
      time: formatForecastTime(forecast.dt, timezoneOffset),
      temp: forecast.main.temp,
      status: forecast.weather[0].description,
      rainProbability: Math.round(forecast.pop * 100),
      rainfall: forecast.rain?.['3h'] ?? 0,
    }))

    const pollution = airPollutionResponse.data.list[0]
    airQuality.value = {
      aqi: pollution.main.aqi,
      pm25: pollution.components.pm2_5,
      pm10: pollution.components.pm10,
    }
  } catch (error) {
    console.error('구장 상세 날씨를 불러오지 못했습니다.', error)
    detailError.value = '구장 상세 날씨를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    detailLoading.value = false
  }
}

onMounted(loadTodayGames)
</script>

<template>
  <section class="app-container baseball-weather">
    <header class="baseball-header">
      <div>
        <p class="baseball-eyebrow">KBO BALLPARK WEATHER</p>
        <h1>⚾ 오늘의 프로야구 구장 날씨</h1>
        <p>{{ todayLabel }} 경기 시간대의 예보를 기준으로 확인합니다.</p>
      </div>
      <UnitToggler />
    </header>

    <div v-if="isLoading" class="baseball-loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-alert v-else-if="loadError" :title="loadError" type="error" :closable="false" show-icon />

    <el-empty v-else-if="!games.length" description="오늘 예정된 경기가 없습니다.">
      <el-button type="primary" @click="loadTodayGames">일정 다시 확인</el-button>
    </el-empty>

    <el-row v-else :gutter="18" class="baseball-game-grid">
      <el-col v-for="gameCard in games" :key="gameCard.id" :xs="24" :md="12" :lg="8">
        <el-card class="baseball-game-card" shadow="hover">
          <div class="game-card-topline">
            <el-tag effect="dark" type="primary">{{ gameCard.game.time }}</el-tag>
            <span>{{ gameCard.stadium.name }}</span>
          </div>

          <div class="baseball-matchup">
            <strong>{{ gameCard.game.away_team }}</strong>
            <span>VS</span>
            <strong>{{ gameCard.game.home_team }}</strong>
          </div>

          <template v-if="gameCard.weather">
            <div class="ballpark-weather-summary">
              <div>
                <span>예상 기온</span>
                <strong>
                  {{ convertTemperature(gameCard.weather.temp) }}{{ configStore.unitSymbol }}
                </strong>
              </div>
              <div>
                <span>날씨</span>
                <strong>{{ gameCard.weather.status }}</strong>
              </div>
              <div v-if="configStore.rainfallVisible">
                <span>강수 확률</span>
                <strong>{{ gameCard.weather.rainProbability }}%</strong>
              </div>
            </div>

            <div class="playability-box">
              <div class="playability-title">
                <strong>날씨 기반 경기 진행 가능성</strong>
                <el-tag :type="gameCard.playability.tagType">
                  {{ gameCard.playability.label }}
                </el-tag>
              </div>
              <el-progress
                :percentage="gameCard.playability.score"
                :status="progressStatus(gameCard.playability.score)"
                :stroke-width="12"
              />
              <p>{{ gameCard.playability.reasons[0] }}</p>
            </div>
          </template>

          <el-alert
            v-else
            :title="gameCard.weatherError"
            type="error"
            :closable="false"
            show-icon
          />

          <el-button
            type="primary"
            plain
            class="baseball-detail-button"
            @click="openDetail(gameCard)"
          >
            구장 날씨 상세보기
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <p class="baseball-disclaimer">
      경기 진행 가능성은 강수 확률·강수량·낙뢰·풍속·기온을 반영한 학습용 예상치이며, 공식 경기 취소
      여부와 다를 수 있습니다.
    </p>
  </section>

  <el-drawer
    v-model="detailVisible"
    :title="selectedGame ? `${selectedGame.stadium.name} 상세 날씨` : '구장 상세 날씨'"
    size="min(720px, 92vw)"
    class="baseball-detail-drawer"
  >
    <div v-if="detailLoading" class="baseball-loading">
      <el-skeleton :rows="10" animated />
    </div>

    <el-alert
      v-else-if="detailError"
      :title="detailError"
      type="error"
      :closable="false"
      show-icon
    />

    <div v-else-if="selectedGame" class="detail-container baseball-drawer-detail">
      <header class="detail-header">
        <p class="detail-eyebrow">BALLPARK WEATHER REPORT</p>
        <h3>
          ⚾ {{ selectedGame.game.away_team }} vs {{ selectedGame.game.home_team }} ·
          {{ selectedGame.game.time }}
        </h3>
        <p>{{ selectedGame.stadium.name }}의 실시간 날씨와 향후 24시간 예보입니다.</p>
      </header>

      <div v-if="selectedGame.playability" class="drawer-playability">
        <strong>경기 진행 가능성 {{ selectedGame.playability.score }}%</strong>
        <el-tag :type="selectedGame.playability.tagType">
          {{ selectedGame.playability.label }}
        </el-tag>
        <ul>
          <li v-for="reason in selectedGame.playability.reasons" :key="reason">{{ reason }}</li>
        </ul>
      </div>

      <div v-if="currentWeather" class="info-card">
        <h4>📍 현재 구장 날씨</h4>
        <p>
          실시간 기온:
          <strong>{{ displayCurrentTemp }}{{ configStore.unitSymbol }}</strong>
        </p>
        <p>체감 온도: {{ displayFeelsLike }}{{ configStore.unitSymbol }}</p>
        <p>기상 현황: {{ currentWeather.status }}</p>
        <p>대기 습도: {{ currentWeather.humidity }}%</p>
        <p>현재 풍속: {{ currentWeather.wind }}m/s</p>
        <template v-if="configStore.rainfallVisible">
          <p>최근 강수량: {{ currentWeather.rainfall }}mm</p>
          <p v-if="currentWeather.rainfall > 0" class="umbrella-message">
            ☔ 비가 오고 있으니 우산을 챙기세요.
          </p>
        </template>
      </div>

      <section v-if="airQuality" class="air-quality-section">
        <h4>🌬️ 실시간 대기질</h4>
        <p>
          통합 대기질 지수:
          <strong class="aqi-badge" :class="aqiInfo.className">
            {{ airQuality.aqi }}단계 · {{ aqiInfo.label }}
          </strong>
        </p>
        <p>초미세먼지(PM2.5): {{ airQuality.pm25 }}μg/m³</p>
        <p>미세먼지(PM10): {{ airQuality.pm10 }}μg/m³</p>
      </section>

      <section v-if="forecastList.length" class="forecast-section">
        <h4>📅 향후 24시간 예보 (3시간 간격)</h4>
        <div class="forecast-grid">
          <article v-for="forecast in forecastList" :key="forecast.timestamp" class="forecast-card">
            <strong>{{ forecast.time }}</strong>
            <span>
              {{ convertTemperature(forecast.temp) }}{{ configStore.unitSymbol }} ·
              {{ forecast.status }}
            </span>
            <template v-if="configStore.rainfallVisible">
              <span>💧 강수 확률 {{ forecast.rainProbability }}%</span>
              <span>🌧️ 예상 강수량 {{ forecast.rainfall }}mm</span>
            </template>
          </article>
        </div>
      </section>
    </div>
  </el-drawer>
</template>
