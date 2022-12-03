<template>
  <div>
    <button type="button" @click="onSort">
      {{ columnInfo.name }}
      <template v-if="sortInfo.column === columnInfo.index">
        <span v-if="sortInfo.direction === 'abc'">&#8595;</span>
        <span v-if="sortInfo.direction === 'zyx'">&#8593;</span>
      </template>
    </button>
    <button type="button" @click="openFilters">Filter</button>
  </div>
</template>

<script>
const sortLine = ["abc", "zyx", ""];
export default {
  components: {},
  props: {
    columnInfo: {
      type: Object,
      default() {
        return {
          index: 0,
          name: "",
        };
      },
    },
    sortInfo: {
      type: Object,
      default() {
        return {
          column: 0,
          direction: "",
        };
      },
    },
    filterInfo: {},
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    onSort() {
      const directionIndex = sortLine.findIndex(
        (dir) => dir === this.sortInfo.direction
      );
      const nextDirection =
        directionIndex === sortLine.length - 1
          ? sortLine[0]
          : sortLine[directionIndex + 1];
      console.log(directionIndex, sortLine.length, nextDirection);
      this.$emit("sorted", {
        column: this.columnInfo.index,
        direction: nextDirection,
      });
    },
    openFilters() {},
  },
};
</script>

<style></style>
