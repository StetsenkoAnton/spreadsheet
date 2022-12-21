<template>
  <div class="table-component">
    <div class="table-component__actions">
      <hr class="mb-1 mt-2" />
      <TableRibbon />
      <hr class="mt-1 mb-0" />
    </div>
    <div ref="tableBox" class="table-component__box">
      <table class="table table-bordered table-hover mb-0 position-relative">
        <TableHeaderRow ref="thead" />
        <tbody :style="{ fontSize: `${fontSize}px` }">
          <tr :style="{ height: `${firstRowH}px` }"></tr>
          <tr v-for="{ lineNumber, row } in visibleTable" :key="lineNumber">
            <td class="bg-light pt-0 pb-0">
              <b>{{ lineNumber + 1 }}</b>
            </td>
            <td v-for="cell in row" :key="cell.column" class="table__td">
              <TableCell :cell-value="cell" :line-number="lineNumber" />
            </td>
          </tr>
          <tr :style="{ height: `${lastRowH}px` }"></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { throttle } from "@/services/helpers.js";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import TableCell from "@/components/TableCell.vue";
import { useTableStore } from "@/store/table.js";
import { useRibbonStore } from "@/store/ribbon.js";
import TableRibbon from "@/components/TableRibbon.vue";

const rowHeightK = 1.75;
const invisibleRows = 10;

export default {
  name: "TheTable",
  components: {
    TableRibbon,
    TableCell,
    TableHeaderRow,
  },
  emits: ["cellUpdated", "cellSelected"],
  mounted() {
    this.$refs.tableBox.addEventListener("scroll", this.throttleScroll);
    this.$nextTick(() => {
      this.getVisibleRows();
    });
  },
  beforeUnmount() {
    this.$refs.tableBox.removeEventListener("scroll", this.throttleScroll);
  },
  data() {
    return {
      visibleRows: 0,
      tableHeadH: 0,
      renderedStartRow: 0,
      throttleScroll: throttle(this.onScroll, 100),
    };
  },
  computed: {
    ...mapState(useTableStore, ["rawTable"]),
    ...mapState(useRibbonStore, ["fontSize"]),
    // filteredTable() {
    //   if (!this.filtersSettings.length) return this.rawTable;
    //   let filteredTable = this.rawTable;
    //   this.filtersSettings.forEach((filtersSettings) => {
    //     filteredTable = this.filterIteration(filtersSettings, filteredTable);
    //   });
    //   return filteredTable;
    // },
    // sortedTable() {
    //   if (!this.sortDirection) return this.filteredTable;
    //   return [...this.filteredTable].sort((a, b) => {
    //     const aVal = a.row[this.sortColumn].value;
    //     const bVal = b.row[this.sortColumn].value;
    //     const aNormalize =
    //       typeof aVal === "number" ? aVal : aVal.toString().toUpperCase();
    //     const bNormalize =
    //       typeof bVal === "number" ? bVal : bVal.toString().toUpperCase();
    //     if (aNormalize > bNormalize) {
    //       return this.sortDirection === "asc" ? 1 : -1;
    //     }
    //     return this.sortDirection === "asc" ? -1 : 1;
    //   });
    // },
    sortedTable() {
      return this.rawTable;
    },
    visibleTable() {
      if (!this.renderedStartRow && !this.renderedEndRow) return [];
      return this.sortedTable.slice(this.renderedStartRow, this.renderedEndRow);
    },
    // sortInfo() {
    //   return {
    //     column: this.sortColumn,
    //     direction: this.sortDirection,
    //   };
    // },
    rowH() {
      return this.fontSize * rowHeightK;
    },
    allRows() {
      return this.sortedTable.length;
    },
    renderedRows() {
      return this.visibleRows + invisibleRows;
    },
    invisibleTopH() {
      return (invisibleRows / 2) * this.rowH + this.tableHeadH;
    },
    firstRowH() {
      return this.renderedStartRow * this.rowH;
    },
    lastRowH() {
      return (this.allRows - this.renderedEndRow) * this.rowH;
    },
    renderedEndRow() {
      return Math.min(this.renderedStartRow + this.renderedRows, this.allRows);
    },
  },
  watch: {
    fontSize() {
      this.getVisibleRows();
    },
  },
  methods: {
    clearFilters() {
      this.filtersSettings = [];
      this.sortColumn = 0;
      this.sortDirection = "";
    },
    filterIteration(filtersSettings, list) {
      return list.filter(({ row }) => {
        const searchNormalize = filtersSettings.search.toUpperCase();
        const cellNormalize = row[filtersSettings.column].value
          .toString()
          .toUpperCase();
        if (filtersSettings.isExact) return searchNormalize === cellNormalize;
        return cellNormalize.includes(searchNormalize);
      });
    },
    // onSort({ column, direction }) {
    //   this.sortColumn = column;
    //   this.sortDirection = direction;
    // },
    // onFilter({ index, filter }) {
    //   if (!filter) this.filtersSettings.splice(index, 1);
    //   else if (index < 0 && filter.search.length)
    //     this.filtersSettings.push(filter);
    //   else this.filtersSettings[index] = filter;
    // },
    // onSelected(e) {
    //   this.$emit("cellSelected", e);
    // },
    // onUnselected(e) {
    //   this.$emit("cellUpdated", e);
    // },
    getVisibleRows() {
      const tableH = this.$refs.tableBox.offsetHeight;
      const tableHeadH = this.$refs.thead.$el.offsetHeight;
      this.visibleRows = Math.round(
        (tableH - tableHeadH) / (this.fontSize * rowHeightK)
      );
      this.tableHeadH = Math.round(tableHeadH);
    },
    onScroll(e) {
      const scrollT = e.target.scrollTop;
      this.renderedStartRow = Math.max(
        0,
        Math.floor((scrollT - this.invisibleTopH) / this.rowH)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.table-component {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "actions" "box";
}
.table-component__actions {
  grid-area: actions;
}
.table-component__box {
  grid-area: box;
  overflow: auto;
}
.table--invisible {
  visibility: hidden;
}
.table__td {
  padding: 0 !important;
  text-align: center;
  height: 1.75em;
}
</style>
