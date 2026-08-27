# skala-vue

- Hands on 과제는 App.vue, code challenge는 CodepracApp.vue에 코드를 작성했다.
- 각각 src/components/exercise 와 src/components/exercise/practices/basic 에 vue파일을 넣었다.
- api 형식 확인과 css를 수정할 때 ai를 사용해 코드를 생성하였다.
- scoped 스타일의 css를 사용하기보다 css파일에 담아 사용하도록 바꾸었다.

## 개인화 프로젝트: 야구장 날씨

- 프로젝트 아키텍쳐와 새로 만든 BaseballWeather.vue,baseballData.js의 코드의 구조작성에서 ai를 활용했다.
- 외부 UI Library로 Element Plus를 선택하고 카드, 버튼, 태그, 진행률, 알림, Skeleton, Empty, Drawer 컴포넌트를 야구장 날씨 화면에 적용했다.
- App.vue의 첫 화면에서 기존 날씨 과제와 야구장 날씨 과제를 선택할 수 있도록 나눴다. 기존 과제 코드는 그대로 유지하고 선택한 화면만 렌더링해 불필요한 API 호출이 발생하지 않도록 했다.
- Parse.bot의 KBO Schedule API를 사용해 해당 월의 프로야구 일정을 가져온 뒤 한국 날짜를 기준으로 오늘 경기만 필터링한다. 같은 브라우저에서 일정을 반복 호출하지 않도록 월간 일정 응답을 날짜별로 localStorage에 저장해 하루 동안 재사용한다.
- 잠실, 고척, 문학, 수원, 대전, 광주, 대구, 사직, 창원의 9개 구장 위치를 baseballData.js에 고정 데이터로 작성했다. 일정 API의 구장 이름을 9개 구장 데이터와 연결해 각 구장의 위도와 경도로 날씨를 요청한다.
- OpenWeather 5 Day / 3 Hour Forecast API에서 경기 시작 시각과 가장 가까운 예보를 찾아 예상 기온, 날씨 상태, 강수 확률을 경기 카드에 표시한다.
- 강수 확률, 예상 강수량, 천둥·번개, 풍속, 기온을 기준으로 점수를 차감하는 방식의 경기 진행 가능성 알고리즘을 작성했다. 돔구장인 고척스카이돔은 외부 강수의 영향을 거의 받지 않도록 별도로 처리했으며, 계산 결과를 진행률과 상태 태그로 보여준다.
- 과제 5의 configStore와 UnitToggler를 그대로 사용해 야구장 날씨에서도 섭씨·화씨 단위변경과 강수량 표시 여부가 동일하게 적용된다.
- Parse.bot과 OpenWeather API 키는 소스코드에 직접 작성하지 않고 .env.local의 VITE_PARSE_API_KEY와 VITE_OPENWEATHER_API_KEY로 분리했다. 컴포넌트에서는 import.meta.env를 통해 환경변수를 불러오며 .env.local은 Git에 업로드되지 않도록 했다.

## 과제 1 - Weather Mockup

- 원본에서 여러 도시를 추가했다.
- 기온은 25도와 30도를 기준으로 선선함, 더움, 매우 더움으로 나눠서 보여준다.
- 각 도시의 예상 강수량을 추가해 카드나 상세보기를 누르면 강수량을 함께 확인할 수 있도록 수정했다.
- find()를 추가로 사용해 입력한 도시를 목록에서 찾도록 했다. 도시 찾기 버튼이나 Enter를 누르면 검색 결과와 강수량을 보여준다.
- 도시 찾기 버튼을 누르거나 Enter를 입력하면 searchCity()가 실행된다. 도시를 찾으면 이름과 강수량을 상태바에 보여주고, 찾지 못하면 일치하는 도시가 없다는 문구를 보여준다.

## 과제 2 - Weather Composition

- 과제 1의 도시와 강수량 데이터를 그대로 사용하고, 입력한 검색어에 맞는 도시만 보여주도록 수정했다.
- 현재 비 소식이 있는 도시 수를 보여주고, 비 오는 도시만 모아서 볼 수 있는 버튼을 추가했다.
- reduce()를 추가로 사용해 현재 화면에 보이는 도시들의 예상 강수량을 모두 더했다. 검색이나 비 오는 도시 필터를 사용하면 합계도 함께 바뀐다.
- rainyCityCount에서 강수량이 0보다 큰 도시만 계산해 현재 비 소식이 있는 도시 수를 보여준다.
- 비 오는 도시만 보기 버튼을 누르면 showRainyOnly 상태가 바뀌고, 검색 결과 중 강수량이 있는 도시만 남긴다. 버튼을 다시 누르면 전체 도시를 보여준다.
- 도시를 검색하거나 비 오는 도시만 보면 reduce()로 계산한 강수량 합계도 현재 목록에 맞춰 자동으로 바뀐다.
- showRainyOnly가 바뀌면 watch()가 변경된 필터 상태를 콘솔에 남기도록 했다.

## 과제 3 - Weather Component

- 과제 2의 6개 도시, 기온 구분, 예상 강수량, 검색, 비 오는 도시 필터 기능을 그대로 유지했다.
- WeatherParent에서 도시 목록과 검색어, 필터 상태, 강수량 계산 결과를 관리하도록 했다.
- SearchBar는 부모에서 검색어와 비 오는 도시 필터 상태를 props로 받는다. 검색어가 바뀌면 update-query, 필터 버튼을 누르면 toggle-rainy 이벤트를 부모로 보낸다.
- WeatherCard는 도시 데이터를 props로 받아 기온과 강수량을 보여준다. 카드 선택과 상세보기는 select-card와 click-detail 이벤트로 부모에 전달한다.
- WeatherSummary 컴포넌트를 추가해 현재 표시된 도시 수, 비 소식이 있는 도시 수, 현재 목록의 강수량 합계를 props로 받아 한곳에 보여준다.
- 강수량이 있는 도시 카드에만 우산 알림 버튼을 추가했다. 버튼을 누르면 WeatherCard가 umbrella-reminder 이벤트와 도시 이름, 강수량을 부모로 보낸다.
- WeatherParent는 umbrella-reminder를 받아 상태바에 해당 도시의 강수량과 우산을 챙기라는 문구를 보여준다. @click.stop을 사용해 우산 알림을 누를 때 카드 선택 이벤트가 함께 실행되지 않도록 했다.

## 과제 4 - Weather Router

- 과제 3의 6개 도시, 예상 강수량, 비 오는 도시 필터, 강수량 합계, 우산 알림 기능을 라우터 화면에도 그대로 적용했다.
- router/index.js에 날씨 대시보드, 서비스 소개, 도시 상세, 우산 가이드, 잘못된 경로에 대한 라우트를 추가했다. 홈 화면을 제외한 View는 lazy loading으로 불러오도록 했다.
- App.vue에서 RouterLink로 날씨 대시보드, 서비스 소개, 우산 가이드를 이동할 수 있게 했고 RouterView에 선택한 화면이 보이도록 했다.
- WeatherHomeView에서 검색어가 바뀌면 watch()가 URL의 search 쿼리에 검색어를 저장한다. 새로고침해도 onMounted()가 쿼리를 읽어 검색 상태를 다시 복구한다.
- 날씨 카드의 상세보기를 누르면 router.push()로 /weather/:cityId 경로에 이동하도록 했다. WeatherDetailView는 URL의 cityId를 읽어 6개 도시의 기온, 날씨, 습도, 풍속, 강수량을 보여준다.
- 존재하지 않는 도시 ID나 잘못된 경로로 접속하면 catch-all 라우트를 통해 NotFoundView를 보여주고, 버튼을 누르면 날씨 메인으로 돌아가도록 했다.
- 개인 추가 View로 RainGuideView를 만들었다. 비 소식이 있는 도시와 예상 강수량 합계를 보여주고, 도시 버튼을 누르면 해당 도시의 상세 화면으로 이동한다.

## 과제 5 - Weather Store

- 과제 4까지 만든 날씨 대시보드에 Pinia Store를 적용해 여러 컴포넌트가 같은 설정을 사용할 수 있도록 했다.
- configStore에 현재 온도 단위를 저장하는 unit 상태와 단위 기호를 반환하는 unitSymbol getter, 섭씨와 화씨를 바꾸는 toggleUnit action을 작성했다.
- UnitToggler 컴포넌트를 Navigation Bar에 배치했다. 단위변경 버튼을 누르면 toggleUnit()이 실행되고 현재 단위와 기호가 함께 바뀐다.
- WeatherCard와 WeatherDetailView에서 computed()를 사용해 Store의 단위가 화씨일 때 `(섭씨 × 9 / 5) + 32`로 기온을 변환한다. 원본 기온 데이터는 수정하지 않고 화면에 표시되는 값만 변경되도록 했다.
- 개인 추가 기능으로 configStore에 강수량 표시 여부를 저장하는 rainfallVisible 상태, 버튼 문구를 정하는 rainfallButtonLabel getter, 표시 상태를 바꾸는 toggleRainfall action을 추가했다.
- 강수량 숨기기 버튼을 누르면 WeatherCard와 WeatherDetailView의 강수량이 동시에 숨겨지고, 강수량과 관련된 우산 알림 버튼과 안내 문구도 함께 보이지 않도록 했다. 다시 강수량 보기 버튼을 누르면 기존 기능이 그대로 나타난다.
- 온도 단위와 강수량 표시 상태를 각 컴포넌트에서 따로 관리하지 않고 configStore에서 관리해 어느 화면에서든 같은 설정이 적용되도록 했다.

## 과제 6 - Weather Axios

- Axios 라이브러리를 설치하고 WeatherHomeView에서 OpenWeather Current Weather API를 호출해 기존의 고정 날씨 데이터를 실시간 데이터로 변경했다.
- 서울, 수원, 부산, 용인, 성남, 안양의 날씨를 Promise.all()로 동시에 요청하고, 응답받은 기온, 날씨 상태, 최근 강수량을 기존 WeatherCard 형식에 맞게 가공했다. 요청 중에는 로딩 문구를 보여주고 통신 실패 시 콘솔에 에러가 남도록 처리했다.
- 기존 과제의 6개 도시 검색, 비 오는 도시만 보기, 강수 요약, 우산 알림 기능을 유지했다. 모의 강수량 대신 OpenWeather 응답의 최근 강수량을 사용해 필터와 합계가 실시간 데이터에 맞춰 계산된다.
- WeatherDetailView는 Current Weather API에서 받은 위도와 경도를 이용해 무료 플랜에 포함된 5 Day / 3 Hour Forecast API와 Air Pollution API를 추가로 호출한다.
- 예보 데이터 중 8개 구간을 사용해 향후 24시간의 3시간 단위 기온, 날씨 상태, 강수 확률, 예상 강수량을 보여준다. 도시의 timezone 값을 적용해 각 예보 시각도 지역 시간에 맞게 표시한다.
- Air Pollution API의 AQI를 좋음부터 매우 나쁨까지 5단계로 구분하고, 초미세먼지(PM2.5)와 미세먼지(PM10) 수치를 함께 보여준다.
- 과제 5에서 만든 Pinia 설정을 실시간 데이터에도 적용했다. 단위변경 버튼을 누르면 현재 기온, 체감 온도, 예보 기온이 함께 섭씨 또는 화씨로 바뀌고, 강수량 숨기기를 사용하면 날씨 카드와 현재 날씨 상세의 강수량 및 우산 안내가 함께 숨겨진다.
- 기타 외부 API 실습으로 AxiosJson 컴포넌트에서 JSONPlaceholder API를 사용했다. GET으로 목록을 읽고 POST, PUT, DELETE 요청으로 추가, 수정, 삭제 기능을 구현했다.