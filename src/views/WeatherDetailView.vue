<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
  city_04: { english: 'Yongin', korean: '경기도 용인시 수지구' },
  city_05: { english: 'Seongnam', korean: '경기도 성남시 분당구' },
  city_06: { english: 'Anyang', korean: '경기도 안양시 동안구' },
}
const formatForecastTime = (timestamp, timezoneOffset) => {
  const cityTime = new Date((timestamp + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(cityTime)
}
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
onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]
  if (!targetCity) {
    router.replace('/not-found')
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    const currentResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: {
        q: `${targetCity.english},KR`,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })
    const raw = currentResponse.data
    const { lat, lon } = raw.coord
    cityData.value = {
      name: targetCity.korean,
      temp: raw.main.temp,
      feelsLike: raw.main.feels_like,
      status: raw.weather[0].description,
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
      rainfall: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
    }
    const [forecastResponse, airPollutionResponse] = await Promise.all([
      axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr', cnt: 8 },
      }),
      axios.get(`${WEATHER_BASE_URL}/air_pollution`, {
        params: { lat, lon, appid: API_KEY },
      }),
    ])
    const timezoneOffset = forecastResponse.data.city.timezone
    forecastList.value = forecastResponse.data.list.map((forecast) => ({
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
    console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    errorMessage.value = '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
})
const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
const displayFeelsLike = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.feelsLike
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
const displayForecastTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }
  return Math.round(temp)
}
</script>

<template>
  <div class="detail-container">
    <header class="detail-header">
      <p class="detail-eyebrow">LIVE WEATHER REPORT</p>
      <h3>📊 지역별 상세 기상 관측 정보</h3>
      <p>OpenWeather 실시간 데이터와 향후 24시간 예보입니다.</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <span class="loading-icon" aria-hidden="true">↻</span>
      <span>날씨 상세 정보를 동기화하는 중입니다...</span>
    </div>

    <template v-else>
      <div v-if="cityData" class="info-card">
        <h4>📍 지정 지역: {{ cityData.name }}</h4>
        <p>
          실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </p>
        <p>체감 온도: {{ displayFeelsLike }}{{ configStore.unitSymbol }}</p>
        <p>기상 현황: {{ cityData.status }}</p>
        <p>대기 습도: {{ cityData.humidity }}</p>
        <p>현재 풍속: {{ cityData.wind }}</p>
        <template v-if="configStore.rainfallVisible">
          <p>최근 1시간 강수량: {{ cityData.rainfall }}mm</p>
          <p v-if="cityData.rainfall > 0" class="umbrella-message">☔ 비가 오고 있으니 우산을 챙기세요.</p>
        </template>
      </div>
      <div v-else>
        <p>{{ errorMessage || '해당 지역의 상세 데이터를 확인할 수 없습니다.' }}</p>
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
            <span>{{ displayForecastTemp(forecast.temp) }}{{ configStore.unitSymbol }} · {{ forecast.status }}</span>
            <span>💧 강수 확률 {{ forecast.rainProbability }}%</span>
            <span>🌧️ 예상 강수량 {{ forecast.rainfall }}mm</span>
          </article>
        </div>
      </section>
    </template>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>