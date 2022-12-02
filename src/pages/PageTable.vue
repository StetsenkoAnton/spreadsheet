<template>
  <div>
    <div>Row number <input type="number" v-model.number="rowSelected" /></div>
    <div>First value <input type="text" v-model="firstValue" /></div>
    <hot-table
      ref="table"
      :data="dataTable"
      :settings="settings"
      :cell="cellComputed"
      :afterBeginEditing="event"
      :afterChange="event"
      :afterInit="event"
      :afterUpdateData="event"
      :afterSelection="event"
      :afterSetDataAtCell="event"
      :beforeKeyDown="event"
      :afterSelectionByProp="event"
      :afterSelectionEnd="event"
      :afterSelectionEndByProp="event"
    />
    <button type="button" @click="importFile">Import CSV</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { data } from "./constants.js";
// import {CommentObject} from "handsontable/plugins/comments";

registerAllModules();

const customRender = (
  instance,
  td,
  row,
  column,
  prop,
  value,
  cellProperties
) => {
  console.log(value);
  Handsontable.renderers.TextRenderer.apply(this, [
    instance,
    td,
    row,
    column,
    prop,
    value.value,
    cellProperties,
  ]);
};

const customEditor = (
  instance,
  td,
  row,
  column,
  prop,
  value,
  cellProperties
) => {
  console.log(value);
  const input = document.createElement("input");
  input.value = value.value;
  // div.style.width = `${value * 10}px`;
  //
  // // addClassWhenNeeded(td, cellProperties);
  // Handsontable.dom.addClass(div, "progressBar");
  // Handsontable.dom.empty(td);

  td.appendChild(input);
};

export default defineComponent({
  components: {
    HotTable,
  },
  // mounted() {
  //   console.log(this.$refs.table);
  // },
  data() {
    return {
      settings: {
        rowHeaders: true,
        colHeaders: true,
        // contextMenu: true,
        filters: true,
        dropdownMenu: true,
        sortIndicator: true,
        columnSorting: true,
        height: "auto",
        licenseKey: "non-commercial-and-evaluation",
        columns: [
          { renderer: customRender, editor: customEditor },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
          { renderer: customRender },
        ],
      },
      data: data,
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
      // data[0][1] = this.firstValue;
      // return [...data];
      return [
        [
          { value: false, id: "1" },
          { value: "Tagcat", id: "2" },
          { value: "United Kingdom", id: "3" },
          { value: "Classic Vest", id: "4" },
          { value: "11/10/2020", id: "5" },
          { value: "01-2331942", id: "6" },
          { value: true, id: "7" },
          { value: "172", id: "8" },
          { value: 2, id: "9" },
          { value: 2, id: "10" },
        ],
        [
          { value: true, id: "11" },
          { value: "Zoomzone", id: "12" },
          { value: "Indonesia", id: "13" },
          { value: "Cycling Cap", id: "14" },
          { value: "03/05/2020", id: "15" },
          { value: "88-2768633", id: "16" },
          { value: true, id: "17" },
          { value: "188", id: "18" },
          { value: 6, id: "19" },
          { value: 2, id: "20" },
        ],
      ];
    },
  },
  methods: {
    event(e, name, s, w, d, f) {
      console.log(name, e, s, w, d, f);
    },
    importFile() {},
  },
});
</script>

<style>
.handsontable {
  font-size: 1rem;
}
td.cell-busy {
  background-color: rgba(2, 2, 2, 0.1);
  pointer-events: none;
}
</style>
