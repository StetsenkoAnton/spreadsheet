<template>
  <main class="container pt-5">
    <h3>
      <i class="icon icon-folder-open" :style="{ color: '#ffc107' }" />
      Список файлів
    </h3>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item d-flex gap-2 align-items-center"
        v-for="file in fileList"
        :key="file.name"
      >
        <i class="icon icon-file-excel text-success" />
        <RouterLink :to="{ path: 'table', query: { file: file.name } }">
          {{ file.name }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<script>
import { getAllFiles } from "../services/api";

export default {
  name: "PageHome",
  async mounted() {
    // if (import.meta.env.MODE === "development") {
    //   this.fileList = [{ name: "first" }, { name: "second" }];
    // } else this.fileList = await getAllFiles();
    this.fileList = await getAllFiles();
  },
  data() {
    return {
      fileList: [],
    };
  },
};
</script>
