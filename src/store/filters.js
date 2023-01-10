import { defineStore } from "pinia";
import { useTableStore } from "./table";

function filterIteration(filtersSettings, list) {
  return list.filter(({ row }) => {
    const searchNormalize = filtersSettings.search.toUpperCase();
    const cellNormalize = row[filtersSettings.column].value
      .toString()
      .toUpperCase();
    if (filtersSettings.isExact || searchNormalize === "") {
      return searchNormalize === cellNormalize;
    }
    return cellNormalize.includes(searchNormalize);
  });
}

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    sortSettings: null,
    filtersSettings: [],
  }),
  getters: {
    filteredTable() {
      const { rawTable } = useTableStore();
      if (!this.filtersSettings.length) return rawTable;
      let filteredTable = rawTable;
      this.filtersSettings.forEach((filtersSettings) => {
        filteredTable = filterIteration(filtersSettings, filteredTable);
      });
      return filteredTable;
    },
    sortedTable() {
      if (!this.sortSettings) return this.filteredTable;
      return [...this.filteredTable].sort((a, b) => {
        const aVal = a.row[this.sortSettings.column].value;
        const bVal = b.row[this.sortSettings.column].value;
        const aNormalize =
          typeof aVal === "number" ? aVal : aVal.toString().toUpperCase();
        const bNormalize =
          typeof bVal === "number" ? bVal : bVal.toString().toUpperCase();
        if (aNormalize > bNormalize) {
          return this.sortSettings.direction === "asc" ? 1 : -1;
        }
        return this.sortSettings.direction === "asc" ? -1 : 1;
      });
    },
  },
  actions: {
    setStoreSort(sort) {
      this.sortSettings = sort;
    },
    setStoreFilter({ index, filter }) {
      if (!filter) this.filtersSettings.splice(index, 1);
      else if (index < 0) this.filtersSettings.push(filter);
      else this.filtersSettings[index] = filter;
    },
    resetStoreFilters() {
      this.sortSettings = null;
      this.filtersSettings = [];
    },
  },
});
