<template>
  <div class="header-cell">
    <div></div>
    <button class="header-cell__sort" type="button" @click="onSort">
      {{ columnInfo.name }}
      <template v-if="sortInfo.column === columnInfo.index">
        <span v-if="sortInfo.direction === 'abc'">&#8595;</span>
        <span v-if="sortInfo.direction === 'zyx'">&#8593;</span>
      </template>
    </button>
    <CustomTableHeaderFilters
      :column-info="columnInfo"
      :data-table="dataTable"
      :filter-info="filterInfo"
      @sorted="onSort"
      @filtered="onFilter"
    />
  </div>
</template>

<script>
import CustomTableHeaderFilters from "@/components/CustomTableHeaderFilters.vue";

const sortLine = ["abc", "zyx", ""];
export default {
  components: { CustomTableHeaderFilters },
  props: {
    dataTable: {
      type: Array,
      default() {
        return [];
      },
    },
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
    filterInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showFilterModal: false,
    };
  },
  methods: {
    onSort() {
      const directionIndex = sortLine.findIndex(
        (dir) => dir === this.sortInfo.direction
      );
      const nextDirection =
        directionIndex === sortLine.length - 1
          ? sortLine[0]
          : sortLine[directionIndex + 1];
      this.$emit("sorted", {
        column: this.columnInfo.index,
        direction: nextDirection,
      });
    },
    onFilter(newValue) {
      this.$emit("filtered", newValue);
    },
    openFilters() {
      this.showFilterModal = true;
    },
    applyFilter() {
      this.showFilterModal = false;
    },
    resetFilter() {
      this.showFilterModal = false;
    },
  },
};
</script>

<style>
.header-cell {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.header-cell__sort {
  display: flex;
}
</style>
