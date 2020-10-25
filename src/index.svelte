<script lang="ts">
  import { loader } from './client/JiraLoader';

  const onFileLoad = (event) => {
    const reader = new FileReader();
    const CSVData: string[][] = [];

    reader.onload = function (file) {
      reader.result.toString().split('\n').forEach(line => {
        const items = line.split(',');

        if (items.length > 1) {
          CSVData.push(items);
        }
      });
      console.log(loader(CSVData));
    };

    reader.readAsText(event.target.files[0]);
    // console.log(event.target.files);
  };
</script>
<style lang="postcss">
</style>
<form on:submit|preventDefault>
  <input type="file" on:change={onFileLoad} name="files" accept=".csv">
  <input type="submit" value="Загрузить CSV">
</form>
