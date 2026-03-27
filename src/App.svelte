<script lang="ts">
  import { handleFile } from "./parser/index";
  let fileInput: HTMLInputElement | undefined = $state();
</script>

<div>
  <form
    onsubmitcapture={(e) => {
      e.preventDefault();
      if (!fileInput?.files?.[0]) {
        alert("请上传文件");
        return;
      }
      handleFile(fileInput.files[0]);
    }}
    class="main"
  >
    <label
      >上传文件:<input
        type="file"
        accept=".mcstructure"
        bind:this={fileInput}
      /></label
    >
    <button type="submit" title="处理">处理文件</button>
  </form>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    align-items: start;
    background-color: azure;
  }
</style>
