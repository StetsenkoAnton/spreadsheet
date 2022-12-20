import { defineStore } from "pinia";

export const useTableStore = defineStore("table", {
  state: () => ({
    tableName: "",
    sheetName: "",
    selectedList: [],
    rawTable: [],
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
