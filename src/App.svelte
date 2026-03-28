<script lang="ts">
  import Value from "./nbtUI/Value.svelte";
  import { handleFile, type NBTChunkData } from "./parser/index";
  let fileInput: HTMLInputElement | undefined = $state();
  let nbtData: NBTChunkData = $state();
</script>

<form
  onsubmitcapture={(e) => {
    e.preventDefault();
    if (!fileInput?.files?.[0]) {
      alert("请上传文件");
      return;
    }
    nbtData = undefined;
    handleFile(fileInput.files[0]).then((value) => {
      value.name = "root";
      nbtData = value;
    });
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

<div id="nbt-structure">
  {#if nbtData?.value}
    <Value nbtData={nbtData.value} name={nbtData.name}></Value>
  {/if}
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    align-items: start;
    background-color: azure;
  }
</style>
