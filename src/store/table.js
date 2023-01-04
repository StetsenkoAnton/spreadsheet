import { defineStore } from "pinia";
import {
  getTable,
  unSubscribeEv,
  subscribeEv,
  streamSend,
} from "@/services/api.js";
import { selected, table } from "@/pages/mock.js";
import { SEVENTS } from "../../core/spreadsheet-events.js";

export const useTableStore = defineStore("table", {
  state: () => ({
    fileName: "",
    sheetName: "",
    selectedList: [],
    rawTable: [],
  }),
  getters: {
    firstRow: (state) => (state.rawTable.length ? state.rawTable[0].row : []),
  },
  actions: {
    getTableFile(name) {
      if (import.meta.env.MODE === "development") {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.fileName = "Test name";
            this.sheetName = "Test sheet name";
            this.rawTable = table;
            this.setSelectedList(selected);
            resolve();
          }, 1000);
        });
      } else {
        return getTable(name)
          .then((table) => {
            this.fileName = table.name;
            this.sheetName = table.sheetName;
            this.rawTable = table.data;
            this.setSelectedList(table.selectedList);
            return table.name;
          })
          .then((fileName) => {
            subscribeEv(
              SEVENTS.CELL.FOCUSED,
              (e) => {
                this.setSelectedList(e.selectedList);
              },
              fileName
            );
            subscribeEv(SEVENTS.CELL.SAVED, this.cellUpdateGet, fileName);
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    },
    cellUpdateGet({ row, col, value, selectedList }) {
      this.rawTable[row].row[col].value = value;
      this.setSelectedList(selectedList);
    },
    cellSelectSend(val) {
      streamSend(SEVENTS.CELL.FOCUS, {
        ...val,
        tableName: this.fileName,
        sheetName: this.sheetName,
      });
    },
    cellUpdateSend(val) {
      streamSend(SEVENTS.CELL.SAVE, {
        ...val,
        tableName: this.fileName,
        sheetName: this.sheetName,
      });
    },
    setSelectedList(newList) {
      if (!this.rawTable.length) return;
      const oldList = this.selectedList;
      // unselected
      if (oldList.length) {
        oldList.forEach(({ row, col }) => {
          this.rawTable[row].row[col].selected = false;
        });
      }
      // selected
      if (newList.length) {
        newList.forEach(({ row, col }) => {
          this.rawTable[row].row[col].selected = true;
        });
      }
      this.selectedList = newList;
    },
    resetStoreFile() {
      this.fileName = "";
      this.sheetName = "";
      this.rawTable = [];
      this.setSelectedList([]);
      unSubscribeEv(SEVENTS.CELL.FOCUSED);
      unSubscribeEv(SEVENTS.CELL.SAVED);
    },
  },
});
