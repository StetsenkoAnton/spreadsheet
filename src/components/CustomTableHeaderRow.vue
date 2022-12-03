<template>
  <thead>
    <tr>
      <th />
      <th v-for="val in headerList" :key="val" class="table__th">
        <CustomTableHeaderCell
          :column-info="val"
          :filter-list="[]"
          :filter-info="filterInfo"
          :sort-info="sortInfo"
          @sorted="onSort"
          @filtered="onFilter"
        />
      </th>
    </tr>
  </thead>
</template>

<script>
import CustomTableHeaderCell from "@/components/CustomTableHeaderCell.vue";

export default {
  components: { CustomTableHeaderCell },
  props: {
    dataTable: {
      type: Array,
      default() {
        return [];
      },
    },
    sortInfo: {
      type: Object,
      default() {
        return {
          column: 0,
          direction: "",
        };
      },
    },
    filterInfo: {},
  },
  data() {
    return {};
  },
  computed: {
    headerLength() {
      return this.dataTable[0].row.length;
    },
    headerList() {
      const arr = [];
      for (let i = 1; i <= this.headerLength; i++) {
        arr.push({
          index: i - 1,
          name: this.getAlphabetLetter(i),
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
    onSort(sort) {
      this.$emit("sorted", sort);
    },
    onFilter() {},
  },
};
</script>

<style></style>
