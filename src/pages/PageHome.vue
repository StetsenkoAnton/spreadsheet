<template>
  <main>
    <h1>exel file list and select one</h1>
    <ul>
      <li v-for="file in fileList" :key="file">
        <RouterLink :to="{ path: 'table', query: { file: file.name } }">{{
          file.name
        }}</RouterLink>
      </li>
    </ul>
  </main>
</template>

<script>
import { getAllFiles } from "../services/api";

export default {
  name: "PageHome",
  async mounted() {
    this.fileList = await getAllFiles();
  },
  data() {
    return {
      fileList: [],
    };
  },
};
</script>
