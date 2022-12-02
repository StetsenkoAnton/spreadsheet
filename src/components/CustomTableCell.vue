<template>
  <div :class="cellClass" tabindex="-1" @click="cellFocus" @dblclick="cellEdit">
    <input
      v-if="status === 'edit'"
      class="table-cell__input"
      type="text"
      :value="cellValue.value"
      ref="input"
      @input="onChange"
      @focus="onSelect"
      @blur="onBlur"
    />
    <span v-if="false">{{ cellValue.value }}</span>
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
      status: STATUS.edit,
    };
  },
  computed: {
    cellClass() {
      return {
        "table-cell": true,
        "table-cell--edit": this.status === STATUS.edit,
        "table-cell--focus": this.status === STATUS.focus,
      };
    },
  },
  methods: {
    cellRest() {
      // console.log("cellRest");
      // this.status = STATUS.rest;
      // document.body.removeEventListener('click', this.cellRest);
    },
    cellFocus() {
      // console.log("cellFocus");
      // this.status = STATUS.focus;
      // this.$nextTick(() => {
      //   document.body.addEventListener("click", this.cellRest);
      // });
    },
    cellEdit() {
      // this.status = STATUS.edit;
      // this.$nextTick(() => {
      //   this.$refs.input.focus();
      // });
    },
    onChange(e) {
      this.$emit("input", {
        lineN: this.lineNumber,
        cellN: this.cellValue.id,
        value: e.target.value,
      });
    },
    onSelect() {
      this.$emit("selected", {
        lineN: this.lineNumber,
        cellN: this.cellValue.id,
        value: this.cellValue.value,
      });
    },
    onBlur() {
      this.$emit("unselected", {
        lineN: this.lineNumber,
        cellN: this.cellValue.id,
        value: this.cellValue.value,
      });
    },
  },
};
</script>

<style>
.table-cell__input {
  //position: absolute;
  //top: 0;
  //bottom: 0;
  //left: 0;
  padding: 0.5em;
  border-color: transparent;
  width: min-content;
  min-width: 0;
}
.table-cell__input:focus,
.table-cell__input:focus-visible {
  border-color: orange;
  outline: none;
}
.table-cell {
  border: 2px solid transparent;
}
.table-cell--focus {
  border-color: blue;
}
.table-cell--edit {
  position: relative;
}
</style>
