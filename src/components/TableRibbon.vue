<template>
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
        <select class="form-select" :value="fontSize" @input="setFontSize">
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
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useRibbonStore } from "@/store/ribbon.js";

export default {
  name: "TableRibbon",
  computed: {
    ...mapState(useRibbonStore, ["fontSize"]),
    filtersSettings() {
      return [];
    },
  },
  methods: {
    ...mapActions(useRibbonStore, ["setStoreFontSize"]),
    setFontSize(e) {
      this.setStoreFontSize(e.target.value);
    },
    clearFilters() {
      this.filtersSettings = [];
      this.sortColumn = 0;
      this.sortDirection = "";
    },
  },
};
</script>
