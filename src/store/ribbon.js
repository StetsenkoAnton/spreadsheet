import { defineStore } from "pinia";

export const useRibbonStore = defineStore("ribbon", {
  state: () => ({
    fontSize: "16",
  }),
  actions: {
    setStoreFontSize(val) {
      this.fontSize = val;
    },
  },
});
