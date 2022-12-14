<template>
  <main class="container-fluid page-stretch">
    <div class="page-header row justify-content-between">
      <div class="col-auto">
        <div class="d-flex gap-2 align-items-center">
          <RouterLink class="btn btn-primary" to="/" title="На головну">
            <i class="icon icon-chevron-left" />
          </RouterLink>
          <div class="fs-3 d-flex gap-2 align-items-center">
            <i class="icon icon-file-excel text-success" />
            {{ tableName }}
          </div>
          <ServerStatus />
        </div>
      </div>
      <div class="col-auto">
        <BtnSaveDocument
          v-if="tableName"
          :table-name="tableName"
          :sheet-name="sheetName"
        />
      </div>
    </div>

    <CustomTable
      class="page-table"
      v-if="rawTable.length"
      :data-table="rawTable"
      :table-name="tableName"
      @cellSelected="onCellSelected"
      @cellUpdated="onCellUpdated"
    />
    <p v-else>{{ emptyText }}</p>
  </main>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";
import BtnSaveDocument from "@/components/BtnSaveDocument.vue";
import {
  getTable,
  streamSelectedCell,
  streamUpdatedCell,
  subscribeFocusEv,
  subscribeUpdateEv,
} from "@/services/api.js";
import { selected, tableBig } from "@/pages/mock.js";
import ServerStatus from "@/components/ServerStatus.vue";

export default {
  name: "PageCustom",
  components: {
    ServerStatus,
    CustomTable,
    BtnSaveDocument,
  },
  mounted() {
    // this.getTableFile();
    setTimeout(() => {
      this.rawTable = tableBig;
    }, 1000);
  },
  data() {
    return {
      fontSize: 16,
      emptyText: "Читання файлу...",
      selectedList: selected,
      // selectedList: [],
      tableName: "",
      sheetName: "",
      rawTable: [],
      // rawTable: [],
    };
  },
  watch: {
    tableName(newName) {
      if (!newName) return;
      subscribeFocusEv((e) => {
        this.selectedList = e.selectedList;
      }, newName);
      subscribeUpdateEv(this.cellUpdate, newName);
    },
    selectedList(newList, oldList) {``
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
    cellUpdate({ row, col, value, selectedList }) {
      this.rawTable[row].row[col].value = value;
      this.selectedList = selectedList;
    },
    async getTableFile() {
      const name = this.$route.query.file;
      if (!name) {
        this.emptyText = "Файл не знайдено";
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

<style lang="scss" scoped>
.page-stretch {
  height: 100vh;
  padding-top: 15px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "header" "table";
  overflow: hidden;
}
.page-header {
  grid-area: header;
}
.page-table {
  grid-area: table;
  overflow: hidden;
}
</style>
