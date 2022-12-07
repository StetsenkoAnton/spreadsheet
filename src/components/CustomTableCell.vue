<template>
  <div :class="cellClass" tabindex="-1" ref="cell" @dblclick="cellEdit">
    <input
      v-if="status === 'edit'"
      class="table-cell__input"
      type="text"
      v-model="cellRaw"
      ref="input"
      @blur="cellRest"
      @keydown.enter="cellRest"
      @keydown.esc="cellRest"
    />
    <span>{{ cellValue.value }}</span>
  </div>
</template>

<script>

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
          id: "0",
        };
      },
    },
    lineNumber: {
      type: Number,
      default: 0,
    },
  },
  emits: ["input", "selected", "unselected"],
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
        "table-cell--edit": this.status === STATUS.edit,
        "table-cell--selected": this.cellValue.selected,
      };
    },
  },
  methods: {
    cellRest() {
      this.status = STATUS.rest;
      this.onBlur();
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
    onChange() {
      this.$emit("input", this.getRequestDate(this.cellRaw));
    },
    onSelect() {
      this.$emit("selected", this.getRequestDate(this.cellValue.value));
    },
    onBlur() {
      const cell = this.cellValue;
      cell.value = this.cellRaw;
      this.$emit("unselected", this.getRequestDate(this.cellRaw));
    },
  },
};
</script>

<style>
.table-cell__input {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-color: transparent;
}
.table-cell__input:focus,
.table-cell__input:focus-visible {
  border-color: orange;
  outline: none;
}
.table-cell {
  height: 100%;
  border: 2px solid transparent;
}
.table-cell:focus-visible,
.table-cell:focus {
  border-color: dodgerblue;
}
.table-cell--edit {
  position: relative;
}
.table-cell--selected {
  border-color: darkseagreen;
  background: lightgrey;
}

</style>
