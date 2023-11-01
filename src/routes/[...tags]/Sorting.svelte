<script lang="ts">
  import { page } from "$app/stores";
  import { createSelect, melt } from "@melt-ui/svelte";
  import { ChevronDown } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { fade } from "svelte/transition";

  const options = [
    {
      label: "Score",
      value: "score",
    },
    {
      label: "Newest",
      value: "id",
    },
    {
      label: "Oldest",
      value: "id:asc",
    },
    {
      label: "Score (Ascending)",
      value: "score:asc",
    },
    {
      label: "Updated",
      value: "updated",
    },
    {
      label: "Updated (Ascending)",
      value: "updated:asc",
    },
  ];
  export let onSelectedChange: any;

  const {
    elements: { trigger, menu, option },
    states: { selectedLabel, open, selected },
  } = createSelect({
    forceVisible: true,
    positioning: {
      placement: "bottom",
      fitViewport: true,
      sameWidth: true,
    },
    defaultSelected: $page.params.tags.includes("sort:")
      ? options.find(
          (o) =>
            o.value ===
            $page.params.tags
              .split(" ")
              .find((t) => t.startsWith("sort:"))!
              .substring(5)
        )!
      : options[0],
    onSelectedChange,
  });

  export const value = selected;
</script>

<div class="flex flex-col gap-1 min-w-[12rem]">
  <button
    class="flex gap-2 h-10 items-center justify-between rounded-lg px-3 py-1 w-full text-sm bg-neutral-900"
    use:melt={$trigger}
  >
    <span class="whitespace-nowrap">
      <span class="text-neutral-300">Sort by</span>
      {$selectedLabel.toLocaleLowerCase() || "none"}
    </span>
    <Icon src={ChevronDown} class="w-4 h-4" />
  </button>
  {#if $open}
    <div
      class="z-50 flex max-h-[300px] flex-col
      overflow-y-auto rounded-lg bg-neutral-900 p-1
      shadow focus:!ring-0"
      use:melt={$menu}
      transition:fade={{ duration: 150 }}
    >
      {#each options as item}
        <div
          class="relative cursor-pointer rounded-lg px-3 py-1 text-sm text-neutral-100"
          use:melt={$option(item)}
        >
          {item.label}
        </div>
      {/each}
    </div>
  {/if}
</div>
