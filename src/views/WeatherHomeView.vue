<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherSummary from '../components/exercise/WeatherSummary.vue'

const router = useRouter()
const route = useRoute()
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', rainfall: 0 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', rainfall: 12 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', rainfall: 2 },
  { id: 'city_04', name: '용인', temp: 28, status: '비', rainfall: 8 },
  { id: 'city_05', name: '성남', temp: 30, status: '맑음', rainfall: 0 },
  { id: 'city_06', name: '안양', temp: 32, status: '비', rainfall: 15 }
])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const showRainyOnly = ref(false)
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})
watch(showRainyOnly, (isRainyOnly) => {
  console.log(`☔ [watch 감지] 라우터 화면의 비 오는 도시만 보기: ${isRainyOnly}`)
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
  return filteredWeatherList.value.reduce((total, item) => total + item.rainfall, 0)
})
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
const handleUmbrellaReminder = (cityName, rainfall) => {
  selectedCityInfo.value = `☔ ${cityName}의 예상 강수량은 ${rainfall}mm입니다. 우산을 챙기세요!`
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

    <BaseDashboardCard>
      <WeatherSummary
        :visible-city-count="filteredWeatherList.length"
        :rainy-city-count="rainyCityCount"
        :rainfall-total="filteredRainfallTotal"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump(item.id)"
        @umbrella-reminder="handleUmbrellaReminder"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>