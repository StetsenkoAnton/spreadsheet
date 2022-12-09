<template>
  <div>
    <div>Font size: <input type="number" v-model.number="fontSize" />px</div>
    <hr />
    <button type="button" @click="clearFilters">Reset filters</button>
    <button type="button" @click="saveFile">Save</button>
    <span> </span>
    <span>{{ tableName }}</span>
    <table class="table">
      <CustomTableHeaderRow
        :data-table="dataTable"
        :filter-info="filtersSettings"
        :sort-info="sortInfo"
        @sorted="onSort"
        @filtered="onFilter"
      />
      <tbody :style="{ fontSize: `${fontSize}px` }">
        <tr v-for="{ lineNumber, row } in visibleTable" :key="lineNumber">
          <th class="table__th">
            {{ lineNumber + 1 }}
          </th>
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
          return this.sortDirection === "abc" ? -1 : 1;
        }
        return this.sortDirection === "abc" ? 1 : -1;
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
    saveFile(e) {
      this.$emit("saveFile", e);
    },
  },
};
</script>

<style>
.table {
  width: 100%;
  height: 1px;
  border: 1px solid;
  border-collapse: collapse;
}
.table__th,
.table__td {
  border: 1px solid;
}
.table__td {
  padding: 0;
  text-align: center;
  height: 100%;
}
* {
  font-size: inherit;
}
</style>
