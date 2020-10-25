<script lang="ts">
  const a: string = "Svelte",
    b: string = "Typescript",
    c: string = "Rollup";
</script>

<style lang="postcss">
  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  h1 {
    font: normal 24pt Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    color: dimgray;
    cursor: default;
  }
</style>
<form>
  <input type="file" accept="csv">
  <input type="submit" value="Загрузить CSV">
</form>
<h1>{a} + {b} + {c}</h1>
