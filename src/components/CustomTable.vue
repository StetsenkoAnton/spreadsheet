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
    <div ref="tableBox" class="table-component__box">
      <table class="table table-bordered table-hover mb-0">
        <CustomTableHeaderRow
          :data-table="dataTable"
          :filter-info="filtersSettings"
          :sort-info="sortInfo"
          @sorted="onSort"
          @filtered="onFilter"
        />
        <tbody :style="{ fontSize: `${fontSize}px` }">
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CustomTableHeaderRow from "@/components/CustomTableHeaderRow.vue";
import CustomTableCell from "@/components/CustomTableCell.vue";

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
  mounted() {
    this.getMaxRows();
    this.$refs.tableBox.addEventListener("scroll", this.throttleScroll);
  },
  data() {
    return {
      fontSize: 16,
      sortColumn: 0,
      sortDirection: "",
      filtersSettings: [],
      maxRows: 0,
      visibleTable: [],
      throttleScroll: this.throttle(this.onScroll, 66),
    };
  },
  computed: {
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
    sortInfo() {
      return {
        column: this.sortColumn,
        direction: this.sortDirection,
      };
    },
    rowByPercent() {
      if (!this.maxRows) return 0;
      return Math.round(
        (this.sortedTable.length - this.maxRows) / this.maxRows
      );
    },
  },
  watch: {
    maxRows(newRows) {
      if (!newRows) this.visibleTable = [];
      else if (this.sortedTable.length <= newRows)
        this.visibleTable = this.sortedTable;
      else this.visibleTable = this.sortedTable.slice(0, newRows);
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
        if (list.isExact) return searchNormalize === cellNormalize;
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
    getMaxRows() {
      const tableHeight = this.$refs.tableBox.offsetHeight;
      const maxRows = (tableHeight / (this.fontSize * 1.56)) * 3;
      this.maxRows = Math.round(maxRows);
    },
    onScroll(e) {
      const boxH = e.target.offsetHeight;
      const scrollH = e.target.scrollHeight;
      const scrollT = e.target.scrollTop;
      const scrollPercent = Math.round((scrollT / (scrollH - boxH)) * 100);
      const window = scrollPercent * this.rowByPercent;
      const windowStart = window < 0 ? 0 : window;
      const windowStopRaw = window + this.maxRows;
      const windowStop =
        windowStopRaw > this.sortedTable.length
          ? this.sortedTable.length
          : windowStopRaw;
      console.log(windowStart, windowStop);
      this.visibleTable = this.sortedTable.slice(windowStart, windowStop);
    },
    throttle(func, time = 33) {
      let inThrottle;
      return function () {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => {
            inThrottle = false;
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
.table__td {
  padding: 0 !important;
  text-align: center;
  height: 100%;
}
</style>
