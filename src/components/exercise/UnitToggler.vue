<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-control">
    <span>
      날씨단위:
      <strong>
        {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
      </strong>
    </span>
    <button class="toggle-btn" @click="configStore.toggleUnit">단위변경</button>
    <button class="rainfall-btn" @click="configStore.toggleRainfall">
      {{ configStore.rainfallButtonLabel }}
    </button>
  </div>
</template>

<style scoped>
.unit-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  text-align: center;
}
.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.rainfall-btn {
  padding: 6px 10px;
  color: #854d0e;
  font-weight: bold;
  background-color: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 4px;
  cursor: pointer;
}
@media (max-width: 720px) {
  .unit-control {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin-left: 0;
  }
}
</style>