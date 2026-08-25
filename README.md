# skala-vue

과제는 App.vue, code challenge는 CodepracApp.vue에 코드를 작성했다.
각각 src/components/exercise 와 src/components/exercise/practices/basic 에 vue파일을 넣었다.

## 과제 1 - Weather Mockup

- 원본에서 여러 도시를 추가했다.
- 기온은 25도와 30도를 기준으로 선선함, 더움, 매우 더움으로 나눠서 보여준다.
- 각 도시의 예상 강수량을 추가해 카드나 상세보기를 누르면 강수량을 함께 확인할 수 있도록 수정했다.
- find()를 추가로 사용해 입력한 도시를 목록에서 찾도록 했다. 도시 찾기 버튼이나 Enter를 누르면 검색 결과와 강수량을 보여준다.

## 과제 2 - Weather Composition

- 과제 1의 도시와 강수량 데이터를 그대로 사용하고, 입력한 검색어에 맞는 도시만 보여주도록 수정했다.
- 현재 비 소식이 있는 도시 수를 보여주고, 비 오는 도시만 모아서 볼 수 있는 버튼을 추가했다.
- reduce()를 추가로 사용해 현재 화면에 보이는 도시들의 예상 강수량을 모두 더했다. 검색이나 비 오는 도시 필터를 사용하면 합계도 함께 바뀌다.
