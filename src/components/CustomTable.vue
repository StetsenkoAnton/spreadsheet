<template>
  <table class="table">
    <CustomTableHeaderRow
      :data-table="dataTable"
      :filter-info="filterInfo"
      :sort-info="sortInfo"
      @sorted="onSort"
      @filtered="onFilter"
    />
    <tbody>
      <tr v-for="{ lineNumber, row } in visibleTable" :key="lineNumber">
        <th class="table__th">
          {{ lineNumber + 1 }}
        </th>
        <td v-for="cell in row" :key="cell.id" class="table__td">
          <CustomTableCell
            :cell-value="cell"
            :line-number="lineNumber"
            @input="event"
            @selected="event"
            @unselected="event"
          />
        </td>
      </tr>
    </tbody>
  </table>
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
  },
  // mounted() {
  //   console.log(this.$refs.table);
  // },
  data() {
    return {
      sortColumn: 0,
      sortDirection: "abc", // "abc", "zyx"
      // filterColumn: 1,
      // filterDirection: "abc", // "abc", "zyx"
    };
  },
  computed: {
    filteredTable() {
      return this.dataTable;
    },
    visibleTable() {
      if (!this.sortDirection) return this.dataTable;
      return [...this.filteredTable].sort((a, b) => {
        if (a.row[this.sortColumn].value.toUpperCase > b.row[this.sortColumn].value.toUpperCase) {
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
    filterInfo() {
      return [];
    },
  },
  methods: {
    event(e) {
      console.log(e);
    },
    onSort({ column, direction }) {
      this.sortColumn = column;
      this.sortDirection = direction;
    },
    onFilter() {},
  },
};
</script>

<style>
.table {
  width: 100%;
  border: 1px solid;
  border-collapse: collapse;
}
.table__th,
.table__td {
  border: 1px solid;
  text-align: center;
}
.table__td {
  padding: 0;
}
</style>
