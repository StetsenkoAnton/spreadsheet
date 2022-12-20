import { defineStore } from "pinia";

export const fileStore = defineStore("file", {
  state: () => ({
    fileName: "",
    sheetName: "",
    selectedList: [],
    rawTable: [],
  }),
  // getters: {
  //   doubleCount: (state) => state.count * 2,
  // },
  actions: {
    increment() {
      this.count++;
    },
  },
});
