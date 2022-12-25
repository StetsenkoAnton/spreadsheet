<template>
  <div
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
        @keydown.esc="closeFilter"
      />
      <datalist :id="`datalistOptions${columnInfo.index}`">
        <option v-for="val in unicValues" :key="val" :value="val"></option>
      </datalist>

      <div class="row justify-content-between mt-1 mb-2">
        <div class="col-auto">
          <button
            :class="`btn btn-sm btn-${
              isCurrentSort ? '' : 'outline-'
            }success d-flex align-items-center justify-content-start gap-2`"
            type="button"
            @click="onSort"
          >
            <span>Сорт.</span>
            <i
              :class="[
                'icon',
                `icon-sort-amount-${sortSettings?.direction ?? 'asc'}`,
                isCurrentSort ? '' : 'invisible',
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
            @click="closeFilter"
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
</template>

<script>
import { useTableStore } from "@/store/table.js";

const sortLine = ["asc", "desc", ""];

import { mapActions, mapState } from "pinia";
import { useFiltersStore } from "@/store/filters.js";

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
    isCurrentFilter: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isCurrentSort: {
      type: Boolean,
      default() {
        return false;
      },
    },
    filteredOrderView: {
      type: Number,
      default() {
        return 0;
      },
    },
    filteredOrder: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  created() {
    if (this.isCurrentFilter) this.filter = { ...this.currentFilter };
  },
  mounted() {
    this.$refs.search.focus();
  },
  data() {
    return {
      filter: {
        column: this.columnInfo.index,
        search: "",
        isExact: false,
      },
    };
  },
  computed: {
    ...mapState(useFiltersStore, ["sortSettings", "filtersSettings"]),
    ...mapState(useTableStore, ["rawTable"]),
    currentFilter() {
      return this.filtersSettings[this.filteredOrder];
    },
    unicValues() {
      const list = this.rawTable.map(
        ({ row }) => row[this.columnInfo.index].value
      );
      list.sort();
      return new Set(list);
    },
  },
  methods: {
    ...mapActions(useFiltersStore, ["setStoreSort", "setStoreFilter"]),
    setFilter(val) {
      this.setStoreFilter({
        index: this.filteredOrder,
        filter: val,
      });
      this.closeFilter();
    },
    applyFilter() {
      if (this.filter.search) this.setFilter(this.filter);
      else this.setFilter(null);
    },
    resetFilter() {
      this.setFilter(null);
    },
    closeFilter() {
      this.$emit("close-modal");
    },
    onSort() {
      let nextDirection = sortLine[0];
      if (this.isCurrentSort) {
        const directionIndex = sortLine.findIndex(
          (dir) => dir === this.sortSettings.direction
        );
        nextDirection =
          directionIndex === sortLine.length - 1
            ? sortLine[0]
            : sortLine[directionIndex + 1];
      }
      const payload = !nextDirection
        ? null
        : {
            column: this.columnInfo.index,
            direction: nextDirection,
          };
      this.setStoreSort(payload);
    },
  },
};
</script>

<style>
.header-cell__filter-modal {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  background: #fff;
}
</style>
