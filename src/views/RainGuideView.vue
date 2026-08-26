<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rainyCities = [
  { id: 'city_02', name: '수원', rainfall: 12 },
  { id: 'city_03', name: '부산', rainfall: 2 },
  { id: 'city_04', name: '용인', rainfall: 8 },
  { id: 'city_06', name: '안양', rainfall: 15 },
]
const totalRainfall = computed(() => {
  return rainyCities.reduce((total, city) => total + city.rainfall, 0)
})
const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="rain-guide-container">
    <h3>☔ 오늘의 우산 가이드</h3>
    <p>
      비 소식이 있는 도시는 {{ rainyCities.length }}곳이고, 예상 강수량 합계는
      {{ totalRainfall }}mm입니다.
    </p>

    <div class="rain-city-list">
      <button v-for="city in rainyCities" :key="city.id" @click="goToDetail(city.id)">
        {{ city.name }} {{ city.rainfall }}mm · 상세보기
      </button>
    </div>

    <button class="home-button" @click="router.push('/')">← 날씨 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.rain-guide-container {
  padding: 20px;
  color: #1e293b;
  background: #f7faff;
  border: 1px solid #dbe5f0;
  border-radius: 14px;
}
.rain-guide-container h3 {
  margin-bottom: 10px;
  font-weight: 800;
}
.rain-city-list {
  display: grid;
  gap: 8px;
  margin: 18px 0;
}
.rain-city-list button {
  padding: 10px 12px;
  color: #1d4ed8;
  font-weight: 700;
  text-align: left;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
}
.home-button {
  padding: 9px 13px;
  color: #ffffff;
  font-weight: 700;
  background: #2563eb;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}
</style>