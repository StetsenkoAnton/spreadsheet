<template>
  <button type="button" :class="btnClass" @click="onSaveFile">
    <div
      v-if="status === STATUSES.pending"
      class="spinner-border spinner-border-sm"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <i v-else-if="status === STATUSES.resolve" class="icon icon-check" />
    <i v-else-if="status === STATUSES.reject" class="icon icon-close" />
    <span v-else-if="status === STATUSES.rest">Зберегти</span>
  </button>
</template>

<script>
import { streamSaveFile, subscribeDocumentSavedEv } from "@/services/api.js";

const statuses = {
  rest: "",
  pending: "pending",
  resolve: "resolve",
  reject: "reject",
};

export default {
  name: "BtnSaveDocument",
  props: {
    tableName: {
      type: String,
      default: "",
    },
    sheetName: {
      type: String,
      default: "",
    },
  },
  mounted() {
    subscribeDocumentSavedEv(this.documentSaved, this.tableName);
  },
  data() {
    return {
      status: statuses.rest,
      STATUSES: statuses,
    };
  },
  computed: {
    btnClass() {
      return {
        btn: true,
        "btn-outline-success": this.status === statuses.rest,
        "btn-primary": this.status === statuses.pending,
        "btn-success": this.status === statuses.resolve,
        "btn-danger": this.status === statuses.reject,
      };
    },
  },
  methods: {
    onSaveFile() {
      this.status = statuses.pending;
      streamSaveFile({ tableName: this.tableName, sheetName: this.sheetName });
    },
    documentSaved(e) {
      console.log(e);
      this.status = statuses.resolve;
      setTimeout(() => {
        this.status = statuses.rest;
      }, 3000);
    },
  },
};
</script>
