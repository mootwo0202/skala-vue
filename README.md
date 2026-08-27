# skala-vue

- 과제는 App.vue, code challenge는 CodepracApp.vue에 코드를 작성했다.
- 각각 src/components/exercise 와 src/components/exercise/practices/basic 에 vue파일을 넣었다.
- css를 수정할 때 ai를 사용해 코드를 생성하였다.

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