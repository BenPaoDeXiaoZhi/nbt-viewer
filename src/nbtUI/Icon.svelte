<script lang="ts">
  import { TagID } from "../parser";

  type Props = {
    type: `${TagID}` | TagID;
  };
  let { type }: Props = $props();
  export function getUrl(tagId: TagID) {
    switch (Number(type) as TagID) {
      case TagID.Empty:
        return "";
      case TagID.Byte:
        return "byte";
      case TagID.Short:
        return "Short";
      case TagID.Int:
        return "int";
      case TagID.Long:
        return "long";
      case TagID.Float:
        return "float";
      case TagID.Double:
        return "double";
      case TagID.ByteArray:
        return "byte-array";
      case TagID.String:
        return "string";
      case TagID.List:
        return "list";
      case TagID.ComplexObject:
        return "structure";
      case TagID.IntArray:
        return "int-array";
    }
  }
  let readableType = $derived(getUrl(Number(type)));
</script>

<img src="/ui/Data_node_{readableType}.svg" alt={readableType} />

<style>
  img {
    height: 2em;
    margin-right: 0.5em;
  }
</style>
