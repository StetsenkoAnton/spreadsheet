<template>
  <thead class="table-light thead--sticky">
    <tr>
      <th class="table__th" />
      <th
        v-for="val in headerList"
        :key="val"
        class="table__th pb-1 position-relative"
      >
        <div
          class="d-flex gap-1 flex-nowrap align-items-center justify-content-between pb-1"
        >
          <b>{{ val.name }}</b>
          <TableFilter :column-info="val" />
        </div>
        <div class="fw-normal text-nowrap border-top">{{ val.colName }}</div>
      </th>
    </tr>
  </thead>
</template>

<script>
import TableFilter from "@/components/TableFilter.vue";
import { mapState } from "pinia";
import { useTableStore } from "@/store/table.js";

export default {
  components: { TableFilter },
  computed: {
    ...mapState(useTableStore, ["firstRow"]),
    headerLength() {
      return this.firstRow.length;
    },
    headerList() {
      const arr = [];
      for (let i = 0; i < this.headerLength; i++) {
        arr.push({
          index: i,
          name: this.getAlphabetLetter(i + 1),
          colName: this.firstRow[i].value,
        });
      }
      return arr;
    },
  },
  methods: {
    getAlphabetLetter(number) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const alphLenght = alphabet.length;

      let firstLetterN = Math.trunc(number / alphLenght);
      const lastLetterN = number - firstLetterN * alphLenght;

      if (!lastLetterN) firstLetterN = firstLetterN - 1;
      const firstLetter = firstLetterN ? alphabet[firstLetterN - 1] : "";
      const lastLetter = lastLetterN
        ? alphabet[lastLetterN - 1]
        : alphabet[alphLenght - 1];
      return `${firstLetter}${lastLetter}`;
    },
  },
};
</script>

<style lang="scss">
.table__th {
  vertical-align: top;
}
.thead--sticky {
  position: sticky;
  top: 0;
  box-shadow: 0 2px 0 0 #ffc107;
}
</style>
