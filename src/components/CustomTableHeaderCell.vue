<template>
  <div
    class="d-flex flex-nowrap align-items-center justify-content-between pb-1"
  >
    <b>{{ columnInfo.name }}</b>
    <CustomTableHeaderFilters
      :column-info="columnInfo"
      :data-table="dataTable"
      :filter-info="filterInfo"
      :sortInfo="sortInfo"
      @sorted="onSort"
      @filtered="onFilter"
    />
  </div>
  <div class="fw-normal text-nowrap border-top">{{columnInfo.colName}}</div>
</template>

<script>
import CustomTableHeaderFilters from "@/components/CustomTableHeaderFilters.vue";


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
  emits: ["filtered", "sorted"],
  data() {
    return {
      showFilterModal: false,
    };
  },
  methods: {
    onSort(e) {
      this.$emit("sorted", e);
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
