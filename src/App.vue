<script setup>
import { ref } from 'vue'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import BaseballWeather from './components/exercise/BaseballWeather.vue'

const selectedSection = ref('menu')
</script>

<template>
  <section v-if="selectedSection === 'menu'" class="app-container app-mode-menu">
    <p class="mode-menu-eyebrow">WEATHER PROJECTS</p>
    <h1>🌦️ 날씨 과제 선택</h1>
    <p class="mode-menu-description">확인할 과제를 선택해 주세요.</p>

    <div class="mode-choice-grid">
      <el-card class="mode-choice-card" shadow="hover">
        <span class="mode-choice-icon">⛅</span>
        <h2>기존 날씨 과제</h2>
        <p>과제 1부터 과제 5까지 기존에 만든 날씨 실습을 확인합니다.</p>
        <el-button type="primary" @click="selectedSection = 'assignments'"
          >기존 과제 보기</el-button
        >
      </el-card>

      <el-card class="mode-choice-card baseball-choice-card" shadow="hover">
        <span class="mode-choice-icon">⚾</span>
        <h2>야구장 날씨</h2>
        <p>오늘의 KBO 경기와 구장별 날씨, 경기 진행 가능성을 확인합니다.</p>
        <el-button type="success" @click="selectedSection = 'baseball'">야구 날씨 보기</el-button>
      </el-card>
    </div>
  </section>

  <template v-else>
    <div class="app-mode-toolbar">
      <el-button @click="selectedSection = 'menu'">← 과제 선택으로</el-button>
    </div>

    <template v-if="selectedSection === 'assignments'">
      <div class="app-container">
        <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
        <hr />
        <WeatherMockup />
      </div>
      <div class="app-container">
        <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
        <hr />
        <WeatherComposition />
      </div>
      <div class="app-container">
        <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
        <hr />
        <WeatherParent />
      </div>
      <div class="app-container">
        <h1>⛅ 과제 4: 라우터적용</h1>
        <hr />
        <div class="dashboard-wrapper">
          <nav class="navigation-bar">
            <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/rain-guide" class="nav-item">☔ 우산 가이드</RouterLink>
          </nav>
          <main>
            <RouterView />
          </main>
        </div>
      </div>
      <div class="app-container">
        <h1>⛅ 과제 5: 스토어적용</h1>
        <hr />
        <div class="dashboard-wrapper">
          <nav class="navigation-bar">
            <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <UnitToggler />
          </nav>
          <main>
            <RouterView />
          </main>
        </div>
      </div>
    </template>

    <BaseballWeather v-else />
  </template>
</template>
