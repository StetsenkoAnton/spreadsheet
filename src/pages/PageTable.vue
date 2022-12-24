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
            {{ fileName }}
          </div>
          <ServerStatus />
        </div>
      </div>
      <div class="col-auto">
        <BtnSaveDocument
          v-if="fileName"
          :table-name="fileName"
          :sheet-name="sheetName"
        />
      </div>
    </div>

    <TheTable class="page-table" v-if="rawTable.length" />
    <p v-else>{{ emptyText }}</p>
  </main>
</template>

<script>
import TheTable from "@/components/Table.vue";
import BtnSaveDocument from "@/components/BtnSaveDocument.vue";
import ServerStatus from "@/components/ServerStatus.vue";
import { mapState, mapActions } from "pinia";
import { useTableStore } from "@/store/table.js";
import { useFiltersStore } from "@/store/filters.js";

export default {
  name: "PageTable",
  components: {
    ServerStatus,
    TheTable,
    BtnSaveDocument,
  },
  mounted() {
    this.getFile();
  },
  beforeUnmount() {
    this.resetStoreFile();
    this.resetStoreFilters();
  },
  data() {
    return {
      fontSize: 16,
      emptyText: "Читання файлу...",
    };
  },
  computed: {
    ...mapState(useTableStore, ["fileName", "sheetName", "rawTable"]),
  },
  methods: {
    ...mapActions(useTableStore, ["getTableFile", "resetStoreFile"]),
    ...mapActions(useFiltersStore, ["resetStoreFilters"]),
    getFile() {
      const name = this.$route.query.file;
      if (!name) {
        this.emptyText = "Не вірний URL файлу";
        return;
      }
      this.getTableFile(name).catch(() => {
        this.emptyText = "Не можливо прочитати файл або такого файлу не існує";
      });
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
