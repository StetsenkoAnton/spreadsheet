<template>
  <div>
    <CustomTable
      v-if="dataTable.length"
      :data-table="dataTable"
      :selected-list="selectedList"
      @cellSelected="onCellSelected"
      @cellUpdated="onCellUpdated"
    />
    <p v-else>{{ emptyText }}</p>
  </div>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";
import {
  getTable,
  streamSelectedCell,
  streamUpdatedCell,
  subscribeFocusEv,
  subscribeUpdateEv,
} from "@/services/api.js";

export default {
  name: "PageCustom",
  components: {
    CustomTable,
  },
  mounted() {
    this.getTableFile();
    subscribeFocusEv((e) => {
      this.selectedList.push(e);
    });
    subscribeUpdateEv(this.cellUpdate);
  },
  data() {
    return {
      fontSize: 16,
      emptyText: "Loading...",
      selectedList: [
        {
          row: 0,
          col: 0,
        },
        {
          row: 1,
          col: 1,
        },
      ],
      tableName: "",
      sheetName: "",
      rawTable: [
        // {
        //   lineNumber: 0,
        //   row: [
        //     { value: 2, column: 0 },
        //     { value: "Tagcat", column: 1 },
        //     { value: "United Kingdom", column: 2 },
        //     { value: "Classic Vest", column: 3 },
        //     { value: "11/10/2020", column: 4 },
        //     { value: "01-2331942", column: 5 },
        //     { value: true, column: 6 },
        //     { value: "172", column: 7 },
        //     { value: 2, column: 8 },
        //     { value: 22, column: 9 },
        //   ],
        // },
        // {
        //   lineNumber: 1,
        //   row: [
        //     { value: 1, column: 0 },
        //     { value: "Zoomzone", column: 1 },
        //     { value: "Indonesia", column: 2 },
        //     { value: "Cycling Cap", column: 3 },
        //     { value: "03/05/2020", column: 4 },
        //     { value: "88-2768633", column: 5 },
        //     { value: true, column: 6 },
        //     { value: "188", column: 7 },
        //     { value: 6, column: 8 },
        //     { value: 2, column: 9 },
        //   ],
        // },
        // {
        //   lineNumber: 2,
        //   row: [
        //     { value: 10, column: 0 },
        //     { value: "Cycling", column: 1 },
        //     { value: "Ukraine", column: 2 },
        //     { value: "Dark Cap", column: 3 },
        //     { value: "05/09/2002", column: 4 },
        //     { value: "02-2768633", column: 5 },
        //     { value: false, column: 6 },
        //     { value: "155", column: 7 },
        //     { value: 1, column: 8 },
        //     { value: 12, column: 9 },
        //   ],
        // },
        // {
        //   lineNumber: 3,
        //   row: [
        //     { value: 11, column: 0 },
        //     { value: "Tagcat", column: 1 },
        //     { value: "China", column: 2 },
        //     { value: "Light Cap", column: 3 },
        //     { value: "09/09/2002", column: 4 },
        //     { value: "10-2768633", column: 5 },
        //     { value: false, column: 6 },
        //     { value: "122", column: 7 },
        //     { value: 4, column: 8 },
        //     { value: 222, column: 9 },
        //   ],
        // },
      ],
    };
  },
  computed: {
    dataTable() {
      const table = this.rawTable;
      if (!table.length) return [];
      this.selectedList.forEach(({ row, col }) => {
        table[row].row[col].selected = true;
      });
      return table;
    },
  },
  methods: {
    onCellSelected(val) {
      console.log("cellSelected", val);
      streamSelectedCell({
        ...val,
        tableName: this.tableName,
        sheetName: this.sheetName,
      });
    },
    onCellUpdated(val) {
      console.log("cellUpdated", val);
      streamUpdatedCell({
        ...val,
        tableName: this.tableName,
        sheetName: this.sheetName,
      });
    },
    cellUpdate({ row, col, value }) {
      this.rawTable[row].row[col].value = value;
    },
    async getTableFile() {
      const name = this.$route.query.file;
      if (!name) {
        this.emptyText = "File not found";
        return;
      }
      const table = await getTable(name);
      console.log(table);
      this.tableName = table.name;
      this.sheetName = table.sheetName;
      this.rawTable = table.data;
    },
  },
};
</script>

<style></style>
