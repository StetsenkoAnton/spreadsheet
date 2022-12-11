<template>
  <i
    :class="[
      'fs-5',
      'icon',
      'icon-cloud',
      isServerOnline ? 'text-success' : 'text-danger',
    ]"
    :title="isServerOnline ? 'Сервер онлайн' : 'Сервер оффлайн'"
  />
</template>

<script>
import { subscribeServerEv } from "@/services/api.js";

export default {
  name: "ServerStatus",
  mounted() {
    subscribeServerEv((e) => {
      this.isServerOnline = e;
    });
  },
  data() {
    return {
      isServerOnline: true,
    };
  },
};
</script>
