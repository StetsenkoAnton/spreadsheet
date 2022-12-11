<template>
  <div
    class="position-relative d-flex flex-nowrap align-items-center justify-content-between"
  >
    <button
      class="btn btn-sm w-100 d-flex align-items-center justify-content-start gap-2"
      type="button"
      @click="onSort"
    >
      <b>{{ columnInfo.name }}</b>
      <i
        :class="[
          'icon',
          `icon-sort-amount-${sortInfo.direction || 'asc'}`,
          sortInfo.column === columnInfo.index && sortInfo.direction
            ? ''
            : 'invisible',
        ]"
      />
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

const sortLine = ["asc", "desc", ""];
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

<style></style>
