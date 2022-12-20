<template>
  <div class="table-component">
    <div class="table-component__actions">
      <hr class="mb-1 mt-2" />
      <div class="row">
        <div class="col-auto">
          <div class="row">
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-sm btn-warning"
                :disabled="!filtersSettings.length"
                @click="clearFilters"
              >
                Скинути фільтри
              </button>
            </div>
            <div class="col-auto">
              <div
                class="input-group input-group-sm d-flex align-items-center gap-1"
                title="Розмір шрифту"
              >
                <i class="icon icon-text-height" />
                <select class="form-select" v-model.number="fontSize">
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-1 mb-0" />
    </div>
    <div
      ref="tableBox"
      :class="['table-component__box', invisible ? 'table--invisible' : '']"
    >
      <table class="table table-bordered table-hover mb-0 position-relative">
        <CustomTableHeaderRow
          ref="thead"
          :first-row="firstRow"
          :data-table="filteredTable"
          :filter-info="filtersSettings"
          :sort-info="sortInfo"
          @sorted="onSort"
          @filtered="onFilter"
        />
        <tbody :style="{ fontSize: `${fontSize}px` }">
          <tr :style="{ height: `${firstRowH}px` }"></tr>
          <tr v-for="{ lineNumber, row } in visibleTable" :key="lineNumber">
            <td class="bg-light pt-0 pb-0">
              <b>{{ lineNumber + 1 }}</b>
            </td>
            <td v-for="cell in row" :key="cell.column" class="table__td">
              <CustomTableCell
                :cell-value="cell"
                :line-number="lineNumber"
                @selected="onSelected"
                @unselected="onUnselected"
              />
            </td>
          </tr>
          <tr :style="{ height: `${lastRowH}px` }"></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CustomTableHeaderRow from "@/components/CustomTableHeaderRow.vue";
import CustomTableCell from "@/components/CustomTableCell.vue";

const rowHeightK = 1.75;
const invisibleRows = 10;

export default {
  components: {
    CustomTableCell,
    CustomTableHeaderRow,
  },
  props: {
    dataTable: {
      type: Array,
      default() {
        return [];
      },
    },
    tableName: {
      type: String,
      default: "",
    },
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
      invisible: false,
      fontSize: 16,
      sortColumn: 0,
      sortDirection: "",
      filtersSettings: [],
      visibleRows: 0,
      tableHeadH: 0,
      renderedStartRow: 0,
      throttleScroll: this.throttle(this.onScroll, 100),
    };
  },
  computed: {
    firstRow() {
      return this.dataTable[0].row;
    },
    filteredTable() {
      if (!this.filtersSettings.length) return this.dataTable;
      let filteredTable = this.dataTable;
      this.filtersSettings.forEach((filtersSettings) => {
        filteredTable = this.filterIteration(filtersSettings, filteredTable);
      });
      return filteredTable;
    },
    sortedTable() {
      if (!this.sortDirection) return this.filteredTable;
      return [...this.filteredTable].sort((a, b) => {
        const aVal = a.row[this.sortColumn].value;
        const bVal = b.row[this.sortColumn].value;
        const aNormalize =
          typeof aVal === "number" ? aVal : aVal.toString().toUpperCase();
        const bNormalize =
          typeof bVal === "number" ? bVal : bVal.toString().toUpperCase();
        if (aNormalize > bNormalize) {
          return this.sortDirection === "asc" ? 1 : -1;
        }
        return this.sortDirection === "asc" ? -1 : 1;
      });
    },
    visibleTable() {
      if (!this.renderedStartRow && !this.renderedEndRow) return [];
      return this.sortedTable.slice(this.renderedStartRow, this.renderedEndRow);
    },
    sortInfo() {
      return {
        column: this.sortColumn,
        direction: this.sortDirection,
      };
    },
    rowH() {
      return this.fontSize * rowHeightK;
    },
    // tableH() {
    //   return this.rowH * this.allRows;
    // },
    allRows() {
      return this.sortedTable.length;
    },
    renderedRows() {
      return this.visibleRows + invisibleRows;
    },
    invisibleTopH() {
      return ((invisibleRows / 2) * this.rowH) + this.tableHeadH;
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
    onSort({ column, direction }) {
      this.sortColumn = column;
      this.sortDirection = direction;
    },
    onFilter({ index, filter }) {
      if (!filter) this.filtersSettings.splice(index, 1);
      else if (index < 0 && filter.search.length)
        this.filtersSettings.push(filter);
      else this.filtersSettings[index] = filter;
    },
    onSelected(e) {
      this.$emit("cellSelected", e);
    },
    onUnselected(e) {
      this.$emit("cellUpdated", e);
    },
    getVisibleRows() {
      const tableH = this.$refs.tableBox.offsetHeight;
      const tableHeadH = this.$refs.thead.$el.offsetHeight;
      this.visibleRows = Math.round((tableH - tableHeadH) / (this.fontSize * rowHeightK));
      this.tableHeadH = Math.round(tableHeadH);
    },
    onScroll(e) {
      const scrollT = e.target.scrollTop;
      this.renderedStartRow = Math.max(
        0,
        Math.floor((scrollT - this.invisibleTopH) / this.rowH)
      );
    },
    throttle(func, time = 33) {
      let lastArgs = null;
      let inThrottle = false;
      return function () {
        // eslint-disable-next-line prefer-rest-params
        lastArgs = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, lastArgs);
          inThrottle = true;
          setTimeout(() => {
            inThrottle = false;
            // TODO can call twice
            func.apply(context, lastArgs);
          }, time);
        }
      };
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
