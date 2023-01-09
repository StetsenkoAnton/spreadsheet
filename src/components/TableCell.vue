<template>
  <div :class="cellClass" tabindex="-1" ref="cell" @dblclick="cellEdit">
    <textarea
      v-if="status === 'edit'"
      class="table-cell__input"
      v-model="cellRaw"
      ref="input"
      rows="auto"
      @blur="onBlur"
      @keydown.esc="cellRest"
      @keydown.exact.enter="cellRest"
      @keydown.exact.ctrl.enter="onEnter"
    />
    <span>{{ cellValue.value }}</span>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useTableStore } from "@/store/table.js";

const STATUS = {
  rest: "",
  edit: "edit",
  focus: "focus",
};

export default {
  components: {},
  props: {
    cellValue: {
      type: Object,
      default() {
        return {
          value: "",
          column: "0",
          selected: false,
        };
      },
    },
    lineNumber: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      status: STATUS.rest,
      cellRaw: "",
    };
  },
  computed: {
    cellClass() {
      return {
        "table-cell": true,
        "position-relative": this.status === STATUS.edit,
        "bg-secondary text-white": this.cellValue.selected,
      };
    },
  },
  methods: {
    ...mapActions(useTableStore, ["cellUpdateSend", "cellSelectSend"]),
    cellRest() {
      this.status = STATUS.rest;
    },
    cellEdit() {
      if (this.cellValue.selected) return;
      this.status = STATUS.edit;
      this.cellRaw = this.cellValue.value;
      this.onSelect();
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    getRequestDate(value) {
      return {
        row: this.lineNumber,
        col: this.cellValue.column,
        value,
      };
    },
    onSelect() {
      this.cellSelectSend(this.getRequestDate(this.cellValue.value));
    },
    onBlur() {
      this.status = STATUS.rest;
      const cell = this.cellValue;
      cell.value = this.cellRaw;
      this.cellUpdateSend(this.getRequestDate(this.cellRaw));
    },
    onEnter() {
      this.cellRaw = `${this.cellRaw}\n`;
    },
  },
};
</script>

<style lang="scss">
.table-cell__input {
  position: absolute;
  top: 0;
  left: 0;
  border-color: transparent;
  white-space: pre;
  resize: both;
  min-width: calc(100% + 2em);
  min-height: calc(100% + 2em);
}
.table-cell__input:focus,
.table-cell__input:focus-visible {
  border-color: orange;
  outline: none;
}
.table-cell {
  white-space: pre;
  height: 100%;
  padding: 0 2px;
}
.table-cell:focus-visible,
.table-cell:focus {
  box-shadow: inset 0 0 0 2px dodgerblue;
}
.table-cell--edit {
  position: relative;
}
</style>
