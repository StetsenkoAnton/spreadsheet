<template>
  <RouterView />
</template>

<script>
import { RouterView } from "vue-router";

export default {
  name: "App",
  components: { RouterView },
};
</script>

<style>
body {
  padding-top: 15px;
}
</style>
