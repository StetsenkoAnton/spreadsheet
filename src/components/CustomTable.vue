<template>
  <div>
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
    <table class="table table-bordered table-hover">
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
  data() {
    return {
      fontSize: 16,
      sortColumn: 0,
      sortDirection: "", // "abc", "zyx"
      filtersSettings: [],
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
    visibleTable() {
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
  },
};
</script>

<style>
.table {
  width: 100%;
  height: 1px;
  //border: 1px solid;
  border-collapse: collapse;
}
.table__td {
  padding: 0 !important;
  text-align: center;
  height: 100%;
}
</style>
