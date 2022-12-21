import { defineStore } from "pinia";

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    sortColumn: 0,
    sortDirection: "",
    filtersSettings: [],
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,
  },
  actions: {
    setStoreSort({ column, direction }) {
      this.sortColumn = column;
      this.sortDirection = direction;
    },
    setStoreFilter({ index, filter }) {
      if (!filter) this.filtersSettings.splice(index, 1);
      else if (index < 0 && filter.search.length)
        this.filtersSettings.push(filter);
      else this.filtersSettings[index] = filter;
    },
    resetStoreFilters() {
      this.sortColumn = 0;
      this.sortDirection = "";
      this.filtersSettings = [];
    },
  },
});
