<template>
  <div class="header-cell__filter">
    <button
      :class="`btn btn-sm ${
        isCurrentFilter || isCurrentSort
          ? 'btn-warning'
          : 'btn-outline-secondary'
      }`"
      ref="opener"
      type="button"
      @click="openFilters"
    >
      <i class="icon icon-filter" />
      <span v-show="isCurrentFilter">{{ filteredOrderView }}</span>
    </button>
    <TableFilterModal
      v-if="showFilterModal"
      ref="modal"
      :column-info="columnInfo"
      :is-current-filter="isCurrentFilter"
      :is-current-sort="isCurrentSort"
      :filtered-order-view="filteredOrderView"
      :filtered-order="filteredOrder"
      @close-modal="closeFilter"
    />
  </div>
</template>

<script>
import { clickOutside } from "../services/helpers";
import TableFilterModal from "@/components/TableFilterModal.vue";
import { mapState } from "pinia";
import { useFiltersStore } from "@/store/filters.js";

export default {
  components: { TableFilterModal },
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
  },
  data() {
    return {
      handleOutsideClick: () => {},
      showFilterModal: false,
    };
  },
  computed: {
    ...mapState(useFiltersStore, ["sortSettings", "filtersSettings"]),
    filteredOrder() {
      return this.filtersSettings.findIndex(
        ({ column }) => +column === +this.columnInfo.index
      );
    },
    filteredOrderView() {
      return this.filteredOrder + 1;
    },
    isCurrentFilter() {
      return this.filteredOrder >= 0;
    },
    isCurrentSort() {
      return !!(
        this.sortSettings && this.sortSettings.column === this.columnInfo.index
      );
    },
  },
  watch: {
    showFilterModal(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.handleOutsideClick = clickOutside(
            this.$refs.opener,
            this.$refs.modal.$el,
            this.closeFilter
          );
          document.addEventListener("click", this.handleOutsideClick);
        });
      } else document.removeEventListener("click", this.handleOutsideClick);
    },
  },
  methods: {
    openFilters() {
      this.showFilterModal = true;
    },
    closeFilter() {
      this.showFilterModal = false;
    },
  },
};
</script>
