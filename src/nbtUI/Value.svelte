<script lang="ts">
  import { TagID, type NBTType, type TypedValue } from "../parser";
  import Icon from "./Icon.svelte";
  import Value from "./Value.svelte";
  type Props = {
    nbtData: TypedValue<NBTType>;
    name: string;
  };
  const { nbtData: nbtData, name }: Props = $props();
  let showInner = $state(false);

  function isOnlyValue(tagId: TagID) {
    return ![
      TagID.ByteArray,
      TagID.ComplexObject,
      TagID.IntArray,
      TagID.List,
    ].includes(tagId);
  }

  function isList(tagId: TagID) {
    return [TagID.ByteArray, TagID.IntArray, TagID.List].includes(tagId);
  }
</script>

<button
  onclick={(e) => {
    if (!isOnlyValue(nbtData.type)) showInner = !showInner;
    else showInner = false;
  }}
>
  <Icon type={nbtData.type}></Icon>
  <b id="name">{name}</b>
  {#if isOnlyValue(nbtData.type)}
    <p>
      {nbtData.value}
    </p>
  {:else}
    <b id="arrow">
      {#if showInner}
        ▼
      {:else}
        ▶
      {/if}
    </b>
  {/if}
</button>
{#if showInner}
  <div id="innerWrapper">
    {#if isList(nbtData.type)}
      {#each nbtData.value as TypedValue<NBTType>[] as subData, i}
        <Value nbtData={subData} name={String(i)}></Value>
      {/each}
    {:else}
      {#each Object.keys(nbtData.value as { [n: string]: TypedValue<NBTType> }) as subName}
        <Value nbtData={nbtData.value[subName]} name={subName}></Value>
      {/each}
    {/if}
  </div>
{/if}

<style>
  button {
    display: flex;
    flex-direction: row;
    border: 0px;
    background-color: lightgrey;
    border-radius: 0.3em;
    align-items: center;
  }
  p {
    margin: auto;
  }
  #name {
    margin-right: 1em;
  }
  #arrow {
    cursor: pointer;
    border-radius: 0.2em;
    transition: 0.1s;
  }
  #arrow:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  #innerWrapper {
    margin-left: 2em;
  }
</style>
