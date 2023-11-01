<script lang="ts">
  import { browser } from "$app/environment";
  import { tick } from "svelte";

  export let items: any[] = [];
  let grid: HTMLDivElement;
  let columns: { height: number; items: any[] }[] = [];
  export let heights: number[] = [];
  let orderedUntil = 0;
  export let columnCount = 0;

  export const reset = () => {
    columns = [];
    orderedUntil = 0;
  };

  let rows: number[][] = [];
  const refreshGrid = async () => {
    await tick();
    // get the number of columns
    columnCount = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const gap = parseFloat(getComputedStyle(grid).gap) || 8;
    const itemWidth = parseFloat(
      getComputedStyle(grid).gridTemplateColumns.split(" ")[0]
    );

    if (columns.length !== columnCount) {
      columns = Array.from({ length: columnCount }, () => ({
        height: 0,
        items: [],
      }));
      orderedUntil = 0;
    }

    for (; orderedUntil < items.length; orderedUntil++) {
      const minColIndex = Math.max(
        columns.findIndex(
          (col) => col.height === Math.min(...columns.map((col) => col.height))
        ),
        0
      );
      columns[minColIndex].items.push(orderedUntil);
      columns[minColIndex].height += Math.ceil(
        (items[orderedUntil].height / items[orderedUntil].width) * itemWidth +
          gap
      );
    }

    const maxLength = Math.max(...columns.map((arr) => arr.items.length));
    rows = Array.from({ length: maxLength }, (_, i) =>
      columns.map((col) => (col.items.length > i ? col.items[i] : null))
    );

    await tick();

    // loop over grid children and assign margin-top
    const gridItems = Array.from(grid.children) as HTMLElement[];
    gridItems.forEach((item, i) => {
      if (i < columnCount) return;
      item.style.removeProperty("margin-top");

      const diff =
        gridItems[i - columnCount]?.getBoundingClientRect().bottom -
        item.getBoundingClientRect().top;
      if (diff < 0) item.style.marginTop = `${diff + gap}px`;
    });

    heights = [...grid.children]
      .slice(-columnCount)
      .map((e) => e.getBoundingClientRect().top + window.scrollY);
  };

  $: items.length > 0 && browser && refreshGrid();
</script>

<svelte:window on:resize={refreshGrid} />

<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2" bind:this={grid}>
  {#each rows as row}
    {#each row as i}
      {#if i !== null}
        <slot item={items[i]} index={i} />
      {:else}
        <div />
      {/if}
    {/each}
  {/each}
</div>
