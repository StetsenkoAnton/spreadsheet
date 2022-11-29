<template>
  <div>
    <hot-table
      :data="data"
      :rowHeaders="true"
      :colHeaders="true"
      height="auto"
      licenseKey="non-commercial-and-evaluation"
      :filters="true"
      :dropdownMenu="true"
      :sortIndicator="true"
      :columnSorting="true"
      @afterBeginEditing="event"
      :afterChange="event"
      @afterInit="event"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';

// register Handsontable's modules
registerAllModules();

export default defineComponent({
  data() {
    return {
      data: [
        ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
        ['2016', 10, 11, 12, 13],
        ['2017', 20, 11, 14, 13],
        ['2018', 30, 15, 12, 13]
      ],
    };
  },
  components: {
    HotTable,
  },
  methods: {
    event(e, name) {
      console.log(name, e)
    }
  }
});
</script>

<style>
.handsontable {
  font-size: 1rem;
}
</style>
