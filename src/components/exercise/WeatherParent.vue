<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherSummary from './WeatherSummary.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', rainfall: 0 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', rainfall: 12 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', rainfall: 2 },
  { id: 'city_04', name: '용인', temp: 28, status: '비', rainfall: 8 },
  { id: 'city_05', name: '성남', temp: 30, status: '맑음', rainfall: 0 },
  { id: 'city_06', name: '안양', temp: 32, status: '비', rainfall: 15 },
])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const showRainyOnly = ref(false)

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

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watch(showRainyOnly, (isRainyOnly) => {
  console.log(`☔ [watch 감지] 비 오는 도시만 보기: ${isRainyOnly}`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

const showDetail = (cityName, status, rainfall) => {
  window.alert(
    `${cityName}의 현재 날씨는 [${status}] 상태이며, 예상 강수량은 ${rainfall}mm입니다.`,
  )
}

const showUmbrellaReminder = (cityName, rainfall) => {
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
        @click-detail="showDetail"
        @umbrella-reminder="showUmbrellaReminder"
      />

      <p v-if="filteredWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">😭 검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}
</style>
