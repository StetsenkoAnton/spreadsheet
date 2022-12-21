<template>
  <div class="header-cell__filter">
    <button
      :class="`btn btn-sm ${
        isCurrentFilter || isSorted ? 'btn-warning' : 'btn-outline-secondary'
      }`"
      ref="opener"
      type="button"
      @click="openFilters"
    >
      <i class="icon icon-filter" />
      <span v-show="isCurrentFilter">{{ filteredOrderView }}</span>
    </button>
    <div
      v-show="showFilterModal"
      :style="{ width: '240px' }"
      class="card header-cell__filter-modal"
      ref="modal"
    >
      <div class="card-body">
        <div
          v-if="isCurrentFilter"
          class="row align-items-center justify-content-between mb-2"
        >
          <div class="col-auto">
            {{ filteredOrderView }}
            <span class="small">пріоритет</span>
          </div>
          <div class="col-auto">
            <button class="btn btn-warning" type="button" @click="resetFilter">
              Скинути
            </button>
          </div>
        </div>
        <input
          class="form-control"
          type="search"
          ref="search"
          placeholder="Пошук"
          v-model="filter.search"
          :list="`datalistOptions${columnInfo.index}`"
          @keydown.enter="applyFilter"
          @keydown.esc="canselFilter"
        />
        <datalist :id="`datalistOptions${columnInfo.index}`">
          <option v-for="val in unicValues" :key="val" :value="val"></option>
        </datalist>

        <div class="row justify-content-between mt-1 mb-2">
          <div class="col-auto">
            <button
              :class="`btn btn-sm btn-${isSorted ? '' : 'outline-'}success d-flex align-items-center justify-content-start gap-2`"
              type="button"
              @click="onSort"
            >
              <span>Сорт.</span>
              <i
                :class="[
                  'icon',
                  `icon-sort-amount-${sortInfo.direction || 'asc'}`,
                  isSorted ? '' : 'invisible',
                ]"
              />
            </button>
          </div>
          <div class="col-auto">
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="filter.isExact"
                :id="`exactFilter${columnInfo.index}`"
              />
              <label
                class="form-check-label"
                :for="`exactFilter${columnInfo.index}`"
              >
                точний
              </label>
            </div>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-auto">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="canselFilter"
            >
              Відміна
            </button>
          </div>
          <div class="col col-auto">
            <button class="btn btn-primary" type="button" @click="applyFilter">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickOutside from "../services/clickOutside";
const sortLine = ["asc", "desc", ""];

export default {
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
      filterDefault: {
        column: this.columnInfo.index,
        search: "",
        isExact: false,
      },
      filter: { ...this.filterDefault },
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
    isSorted() {
      return (
        this.sortInfo.column === this.columnInfo.index &&
        this.sortInfo.direction
      );
    },
  },
  methods: {
    openFilters() {
      this.showFilterModal = true;
      this.resetValueFilter();
      document.addEventListener("click", this.handleOutsideClick);
      this.$nextTick(() => {
        this.$refs.search.focus();
      });
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
      else this.filter = { ...this.filterDefault };
    },
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
  top: 0;
  left: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  background: #fff;
}
</style>
