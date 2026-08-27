import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const rainfallVisible = ref(true)
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })
  const rainfallButtonLabel = computed(() => {
    return rainfallVisible.value ? '강수량 숨기기' : '강수량 보기'
  })
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }
  function toggleRainfall() {
    rainfallVisible.value = !rainfallVisible.value
  }

  return {
    unit,
    rainfallVisible,
    unitSymbol,
    rainfallButtonLabel,
    toggleUnit,
    toggleRainfall,
  }
})
