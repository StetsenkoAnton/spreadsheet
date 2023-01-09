import { defineStore } from "pinia";
import { STORAGE_KEYS, initStorage, setStorage } from "@/services/storage.js";

export const useRibbonStore = defineStore("ribbon", {
  state: () => ({
    fontSize: initStorage(STORAGE_KEYS.tableFontSize, "16"),
  }),
  actions: {
    setStoreFontSize(val) {
      this.fontSize = val;
      setStorage(STORAGE_KEYS.tableFontSize, val);
    },
  },
});
