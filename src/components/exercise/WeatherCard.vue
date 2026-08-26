<script setup>
defineProps({
  cityItem: {
    type: Object,
    required: true,
  }
})
const emit = defineEmits(['select-card', 'click-detail', 'umbrella-reminder'])
</script>

<template>
  <div
    class="weather-card"
    @click="
      emit(
        'select-card',
        `${cityItem.name}이 선택되었습니다. 예상 강수량은 ${cityItem.rainfall}mm입니다.`,
      )
    "
  >
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ cityItem.temp }}°C</p>
    <p v-if="cityItem.rainfall > 0">예상 강수량: {{ cityItem.rainfall }}mm ☔</p>
    <p v-else>예상 강수량: 0mm ☀️</p>

    <span v-if="cityItem.temp >= 30" class="badge hot">🔥🔥 매우 더움</span>
    <span v-else-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <button
      v-if="cityItem.rainfall > 0"
      class="btn-umbrella"
      @click.stop="emit('umbrella-reminder', cityItem.name, cityItem.rainfall)"
    >
      ☔ 우산 알림
    </button>

    <button
      class="btn-detail"
      @click.stop="
        emit('click-detail', cityItem.name, cityItem.status, cityItem.rainfall)
      "
    >
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
.btn-umbrella {
  margin-left: 8px;
  padding: 4px 8px;
  cursor: pointer;
}
</style>