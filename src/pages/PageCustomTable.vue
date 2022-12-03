<template>
  <div>
    <div>Row number <input type="number" v-model.number="rowSelected" /></div>
    <div>First value <input type="text" v-model="firstValue" /></div>
    <CustomTable
      :data-table="dataTable"
      @cellSelected="event"
      @cellUpdated="event"
    />
  </div>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";

export default {
  name: "PageCustom",
  components: {
    CustomTable,
  },
  // mounted() {
  //   console.log(this.$refs.table);
  // },
  data() {
    return {
      rowSelected: 1,
      firstValue: "Tagcat",
    };
  },
  computed: {
    cellComputed() {
      return [
        {
          row: this.rowSelected,
          col: 0,
          className: "cell-busy",
        },
        {
          row: 1,
          col: 1,
          className: "cell-busy",
          valid: false,
        },
      ];
    },
    dataTable() {
      return [
        {
          lineNumber: 0,
          row: [
            { value: 2, id: "0" },
            { value: "Tagcat", id: "1" },
            { value: "United Kingdom", id: "2" },
            { value: "Classic Vest", id: "3" },
            { value: "11/10/2020", id: "4" },
            { value: "01-2331942", id: "5" },
            { value: true, id: "6" },
            { value: "172", id: "7" },
            { value: 2, id: "8" },
            { value: 2, id: "9" },
          ],
        },
        {
          lineNumber: 1,
          row: [
            { value: 1, id: "0" },
            { value: "Zoomzone", id: "1" },
            { value: "Indonesia", id: "2" },
            { value: "Cycling Cap", id: "3" },
            { value: "03/05/2020", id: "4" },
            { value: "88-2768633", id: "5" },
            { value: true, id: "6" },
            { value: "188", id: "7" },
            { value: 6, id: "8" },
            { value: 2, id: "9" },
          ],
        },
      ];
    },
  },
  methods: {
    event(e, name, s, w, d, f) {
      console.log(name, e, s, w, d, f);
    },
  },
};
</script>

<style></style>
