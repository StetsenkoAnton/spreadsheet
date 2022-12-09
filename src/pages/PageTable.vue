<template>
  <div>
    <CustomTable
      v-if="dataTable.length"
      :data-table="dataTable"
      :table-name="tableName"
      @cellSelected="onCellSelected"
      @cellUpdated="onCellUpdated"
      @saveFile="onSaveFile"
    />
    <p v-else>{{ emptyText }}</p>
  </div>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";
import {
  getTable,
  streamSaveFile,
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
  },
  data() {
    return {
      fontSize: 16,
      emptyText: "Loading...",
      selectedList: [],
      tableName: "",
      sheetName: "",
      rawTable: [],
    };
  },
  computed: {
    dataTable() {
      const table = JSON.parse(JSON.stringify(this.rawTable));
      if (!table.length) return [];
      if (!this.selectedList.length) return table;
      this.selectedList.forEach(({ row, col }) => {
        table[row].row[col].selected = true;
      });
      return table;
    },
  },
  watch: {
    tableName(newName) {
      if (!newName) return;
      subscribeFocusEv((e) => {
        this.selectedList = e.selectedList;
      }, newName);
      subscribeUpdateEv(this.cellUpdate, newName);
    },
  },
  methods: {
    onCellSelected(val) {
      streamSelectedCell({
        ...val,
        tableName: this.tableName,
        sheetName: this.sheetName,
      });
    },
    onCellUpdated(val) {
      streamUpdatedCell({
        ...val,
        tableName: this.tableName,
        sheetName: this.sheetName,
      });
    },
    onSaveFile() {
      streamSaveFile({ tableName: this.tableName, sheetName: this.sheetName });
    },
    cellUpdate({ row, col, value, selectedList }) {
      this.rawTable[row].row[col].value = value;
      this.selectedList = selectedList;
    },
    async getTableFile() {
      const name = this.$route.query.file;
      if (!name) {
        this.emptyText = "File not found";
        return;
      }
      const table = await getTable(name);
      this.tableName = table.name;
      this.sheetName = table.sheetName;
      this.rawTable = table.data;
      this.selectedList = table.selectedList;
    },
  },
};
</script>
