# skala-vue

과제는 App.vue, code challenge는 CodepracApp.vue에 코드를 작성했다.
각각 src/components/exercise 와 src/components/exercise/practices/basic 에 vue파일을 넣었다.

## 과제 1 - Weather Mockup

- 원본에서 여러 도시를 추가했다.
- 기온은 25도와 30도를 기준으로 선선함, 더움, 매우 더움으로 나눠서 보여준다.
- 각 도시의 예상 강수량을 추가해 카드나 상세보기를 누르면 강수량을 함께 확인할 수 있도록 수정했다.
- ref()로 도시 목록과 검색어, 선택한 도시 문구를 반응형 상태로 만들었다.
- v-for로 도시 카드를 반복해서 보여주고, v-if와 v-else로 기온과 강수량에 따라 다른 문구를 출력했다.
- @input으로 검색어를 저장하고, @click과 @click.stop으로 카드 선택과 상세보기 이벤트를 나눠서 처리했다.

## 과제 2 - Weather Composition

- 과제 1의 도시와 강수량 데이터를 그대로 사용하고, 입력한 검색어에 맞는 도시만 보여주도록 수정했다.
- 현재 비 소식이 있는 도시 수를 보여주고, 비 오는 도시만 모아서 볼 수 있는 버튼을 추가했다.
- ref, computed, watch, watchEffect를 사용해 검색어와 필터 상태가 바뀌면 화면과 콘솔에 바로 반영되도록 했다.
- computed()에서 filter()와 includes()를 사용해 검색어가 포함된 도시와 비 오는 도시만 남기고, 비 소식이 있는 도시 수도 계산했다.
- watch()로 선택한 도시와 필터 상태의 변경을 감지하고, watchEffect()로 검색어가 바뀌 때마다 콘솔에 남기도록 했다.