<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const mockDetails = {
  city_01: {
    name: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
    rainfall: 0,
  },
  city_02: {
    name: '경기도 수원시 영통구',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
    rainfall: 12,
  },
  city_03: {
    name: '부산광역시 해운대구',
    temp: 26,
    status: '구름',
    humidity: '65%',
    wind: '5.0m/s',
    rainfall: 2,
  },
  city_04: {
    name: '경기도 용인시 수지구',
    temp: 28,
    status: '비',
    humidity: '78%',
    wind: '3.2m/s',
    rainfall: 8,
  },
  city_05: {
    name: '경기도 성남시 분당구',
    temp: 30,
    status: '맑음',
    humidity: '50%',
    wind: '2.0m/s',
    rainfall: 0,
  },
  city_06: {
    name: '경기도 안양시 동안구',
    temp: 32,
    status: '비',
    humidity: '82%',
    wind: '3.8m/s',
    rainfall: 15,
  }
}
const cityData = ref(null)
onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  } else {
    router.replace('/not-found')
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
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
      <template v-if="configStore.rainfallVisible">
        <p>예상 강수량: {{ cityData.rainfall }}mm</p>
        <p v-if="cityData.rainfall > 0" class="umbrella-message">
          ☔ 비 소식이 있으니 우산을 챙기세요.
        </p>
      </template>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.umbrella-message {
  color: #854d0e;
  font-weight: 700;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>