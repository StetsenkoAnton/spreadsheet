<template>
  <div>
    <CustomTable
      v-if="dataTable.length"
      :data-table="dataTable"
      :selected-list="cellComputed"
      @cellSelected="cellSelected"
      @cellUpdated="cellUpdated"
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
} from "@/services/api.js";

export default {
  name: "PageCustom",
  components: {
    CustomTable,
  },
  async mounted() {
    const name = this.$route.query.file;
    if (!name) {
      this.emptyText = "File not found";
      return;
    }
    const table = await getTable(name);
    this.tableName = table.name;
    this.rawTable = table.data;
  },
  data() {
    return {
      fontSize: 16,
      emptyText: "Loading...",
      cellComputed: [
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
      rawTable: [
        {
          lineNumber: 0,
          row: [
            { value: 2, column: 0 },
            { value: "Tagcat", column: 1 },
            { value: "United Kingdom", column: 2 },
            { value: "Classic Vest", column: 3 },
            { value: "11/10/2020", column: 4 },
            { value: "01-2331942", column: 5 },
            { value: true, column: 6 },
            { value: "172", column: 7 },
            { value: 2, column: 8 },
            { value: 22, column: 9 },
          ],
        },
        {
          lineNumber: 1,
          row: [
            { value: 1, column: 0 },
            { value: "Zoomzone", column: 1 },
            { value: "Indonesia", column: 2 },
            { value: "Cycling Cap", column: 3 },
            { value: "03/05/2020", column: 4 },
            { value: "88-2768633", column: 5 },
            { value: true, column: 6 },
            { value: "188", column: 7 },
            { value: 6, column: 8 },
            { value: 2, column: 9 },
          ],
        },
        {
          lineNumber: 2,
          row: [
            { value: 10, column: 0 },
            { value: "Cycling", column: 1 },
            { value: "Ukraine", column: 2 },
            { value: "Dark Cap", column: 3 },
            { value: "05/09/2002", column: 4 },
            { value: "02-2768633", column: 5 },
            { value: false, column: 6 },
            { value: "155", column: 7 },
            { value: 1, column: 8 },
            { value: 12, column: 9 },
          ],
        },
        {
          lineNumber: 3,
          row: [
            { value: 11, column: 0 },
            { value: "Tagcat", column: 1 },
            { value: "China", column: 2 },
            { value: "Light Cap", column: 3 },
            { value: "09/09/2002", column: 4 },
            { value: "10-2768633", column: 5 },
            { value: false, column: 6 },
            { value: "122", column: 7 },
            { value: 4, column: 8 },
            { value: 222, column: 9 },
          ],
        },
      ],
    };
  },
  computed: {
    dataTable() {
      const table = this.rawTable;
      if (!table.length) return [];
      this.cellComputed.forEach(({ row, col }) => {
        table[row].row[col].selected = true;
      });
      return table;
    },
  },
  methods: {
    cellSelected(val) {
      console.log("cellSelected", val);
      streamSelectedCell(val);
    },
    cellUpdated(val) {
      console.log("cellUpdated", val);
      streamUpdatedCell(val);
    },
  },
};
</script>

<style></style>
