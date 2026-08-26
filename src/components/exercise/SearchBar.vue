<script setup>
defineEmits(['update-query', 'toggle-rainy'])
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  showRainyOnly: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
    <button class="filter-button" @click="$emit('toggle-rainy')">
      {{ showRainyOnly ? '전체 도시 보기' : '비 오는 도시만 보기' }}
    </button>
  </div>
</template>

<style scoped>
.filter-button {
  padding: 6px 10px;
  cursor: pointer;
}
</style>