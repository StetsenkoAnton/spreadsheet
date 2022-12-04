<template>
  <div class="header-cell__filter">
    <button
      :class="{ 'header-cell__filter-btn--active': isCurrentFilter }"
      ref="opener"
      type="button"
      @click="openFilters"
    >
      Filter
      <span v-show="isCurrentFilter">{{ filteredOrderView }}</span>
    </button>
    <div v-show="showFilterModal" class="header-cell__filter-modal" ref="modal">
      <div v-show="isCurrentFilter" class="flex-between">
        <span>{{ filteredOrderView }} priority</span>
        <button type="button" @click="resetFilter">Reset</button>
      </div>
      <input
        type="search"
        ref="search"
        placeholder="search"
        v-model="filter.search"
        :list="`datalistOptions${columnInfo.index}`"
        @keydown.enter="applyFilter"
        @keydown.esc="canselFilter"
      />
      <datalist :id="`datalistOptions${columnInfo.index}`">
        <option v-for="val in unicValues" :key="val" :value="val"></option>
      </datalist>

      <label>
        <input type="checkbox" v-model="filter.isExact" />
        <span>Exact</span>
      </label>
      <div class="flex-between">
        <button type="button" @click="applyFilter">Ok</button>
        <button type="button" @click="canselFilter">Cansel</button>
      </div>
    </div>
  </div>
</template>

<script>
import clickOutside from "../services/clickOutside";

export default {
  //
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
  emits: ["filtered"],
  mounted() {
    this.handleOutsideClick = clickOutside(
      this.$refs.opener,
      this.$refs.modal,
      this.canselFilter
    );
  },
  data() {
    return {
      handleOutsideClick: () => {},
      isExact: false,
      showFilterModal: false,
      filter: {
        column: this.columnInfo.index,
        search: "",
        isExact: false,
      },
    };
  },
  computed: {
    filteredOrder() {
      return this.filterInfo.findIndex(
        ({ column }) => +column === +this.columnInfo.index
      );
    },
    filteredOrderView() {
      return this.filteredOrder + 1;
    },
    isCurrentFilter() {
      return this.filteredOrder >= 0;
    },
    currentFilter() {
      return this.filterInfo[this.filteredOrder];
    },
    unicValues() {
      const list = this.dataTable.map(
        ({ row }) => row[this.columnInfo.index].value
      );
      return new Set(list);
    },
  },
  methods: {
    openFilters() {
      this.showFilterModal = true;
      this.resetValueFilter();
      document.addEventListener("click", this.handleOutsideClick);
      this.$nextTick(() => {
        this.$refs.search.focus();
      })
    },
    applyFilter() {
      this.closeFilter();
      this.$emit("filtered", {
        index: this.filteredOrder,
        filter: this.filter,
      });
    },
    canselFilter() {
      this.closeFilter();
      this.resetValueFilter();
    },
    resetFilter() {
      this.closeFilter();
      this.$emit("filtered", {
        index: this.filteredOrder,
        filter: null,
      });
    },
    closeFilter() {
      this.showFilterModal = false;
      document.removeEventListener("click", this.handleOutsideClick);
    },
    resetValueFilter() {
      if (this.isCurrentFilter) this.filter = { ...this.currentFilter };
    },
  },
};
</script>

<style>
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-cell__filter-btn--active {
  background-color: green;
}
.header-cell__filter-modal {
  position: absolute;
  z-index: 1;
  top: -2em;
  left: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  background: #fff;
  padding: 5px;
  text-align: left;
}
</style>
