<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherSummary from '../components/exercise/WeatherSummary.vue'

const router = useRouter()
const route = useRoute()
const weatherList = ref([])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const showRainyOnly = ref(false)
const isLoading = ref(false)
const API_KEY = '98ff79e1c892b7496fac9c6a13c03d5d'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const CITIES = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '수원', query: 'Suwon,KR' },
  { id: 'city_03', name: '부산', query: 'Busan,KR' },
  { id: 'city_04', name: '용인', query: 'Yongin,KR' },
  { id: 'city_05', name: '성남', query: 'Seongnam,KR' },
  { id: 'city_06', name: '안양', query: 'Anyang,KR' },
]

const toWeatherItem = (id, name, raw) => ({
  id,
  name,
  temp: raw.main.temp,
  status: raw.weather[0].description,
  rainfall: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
})

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    const responses = await Promise.all(
      CITIES.map((city) =>
        axios.get(BASE_URL, {
          params: { q: city.query, appid: API_KEY, units: 'metric', lang: 'kr' },
        }),
      ),
    )
    weatherList.value = responses.map((response, index) => {
      const city = CITIES[index]
      return toWeatherItem(city.id, city.name, response.data)
    })
    console.log('🟢 [API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList.value)
  } catch (error) {
    console.error('🔴 날씨 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})
watch(showRainyOnly, (isRainyOnly) => {
  console.log(`☔ [watch 감지] 비 오는 도시만 보기: ${isRainyOnly}`)
})
const rainyCityCount = computed(() => {
  return weatherList.value.filter((item) => item.rainfall > 0).length
})
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  let result = weatherList.value
  if (query) {
    result = result.filter((item) => item.name.includes(query))
  }
  if (showRainyOnly.value) {
    result = result.filter((item) => item.rainfall > 0)
  }
  return result
})
const filteredRainfallTotal = computed(() => {
  const total = filteredWeatherList.value.reduce((sum, item) => sum + item.rainfall, 0)
  return Number(total.toFixed(1))
})
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
const handleUmbrellaReminder = (cityName, rainfall) => {
  selectedCityInfo.value = `☔ ${cityName}의 최근 강수량은 ${rainfall}mm입니다. 우산을 챙기세요!`
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        :show-rainy-only="showRainyOnly"
        @update-query="(val) => (searchQuery = val)"
        @toggle-rainy="showRainyOnly = !showRainyOnly"
      />
    </BaseDashboardCard>

    <BaseDashboardCard v-if="!isLoading">
      <WeatherSummary
        :visible-city-count="filteredWeatherList.length"
        :rainy-city-count="rainyCityCount"
        :rainfall-total="filteredRainfallTotal"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황 (실시간 OpenWeather 연동)</h3>

      <p v-if="isLoading" style="text-align: center; color: #3498db; font-weight: bold; padding: 20px 0">🔄 OpenWeather에서 실시간 기상 데이터를 수신 중입니다...</p>

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="handleDetailJump(item.id)"
          @umbrella-reminder="handleUmbrellaReminder"
        />

        <p v-if="filteredWeatherList.length === 0" class="empty-weather-message">
          {{ showRainyOnly ? '☀️ 현재 비가 오는 도시가 없습니다.' : '😭 검색 결과와 일치하는 도시가 없습니다.' }}
        </p>
      </template>
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>