<script setup>
defineProps({
  visibleCityCount: {
    type: Number,
    required: true,
  },
  rainyCityCount: {
    type: Number,
    required: true,
  },
  rainfallTotal: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="weather-summary">
    <h3>☔ 강수 요약</h3>
    <p>현재 화면에 표시된 도시: {{ visibleCityCount }}곳</p>
    <p>전체 도시 중 비 소식이 있는 도시: {{ rainyCityCount }}곳</p>
    <p>현재 목록의 예상 강수량 합계: {{ rainfallTotal }}mm</p>
  </div>
</template>

<style scoped>
.weather-summary {
  color: #2c3e50;
}

.weather-summary p {
  margin: 4px 0;
}
</style>
