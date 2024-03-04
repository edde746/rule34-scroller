<script lang="ts">
  import { page } from "$app/stores";
  import { Icon } from "@steeze-ui/svelte-icon";
  import type { PageData } from "./$types";
  import { ChevronLeft, ChevronRight } from "@steeze-ui/lucide-icons";
  import { goto } from "$app/navigation";
  import name from "$lib/name";

  export let data: PageData;

  $: isLastPage = data.tags.length < 100;
  $: currentPage = Number($page.params.page || 1);
</script>

<svelte:head>
  {#if currentPage == 1}
    <title>Tag Directory - {name($page.url.hostname)}</title>
  {:else}
    <title
      >Page {currentPage} - Tag Directory - {name($page.url.hostname)}</title
    >
  {/if}
  <meta
    name="description"
    content="Discover tags like {data.tags
      .sort((a, b) => Math.random() - 0.5)
      .slice(0, 3)
      .map((t) => t.name)
      .join(', ')
      .replace(/_/g, ' ')} and more on {name($page.url.hostname)}"
  />
</svelte:head>

<div class="flex gap-2 items-center justify-between mb-3">
  <a href="/tags/{Math.max(1, currentPage - 1)}">
    <Icon src={ChevronLeft} class="w-5 h-5" />
    <span class="sr-only">Previous Page</span>
  </a>
  <input
    type="number"
    value={$page.params.page || "1"}
    on:change={(e) => goto(`/tags/${e.target.value}`)}
    class="w-min bg-transparent text-center"
  />
  <a href="/tags/{isLastPage ? currentPage : currentPage + 1}">
    <Icon src={ChevronRight} class="w-5 h-5" />
    <span class="sr-only">Previous Page</span>
  </a>
</div>

<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-4 links pb-6">
  {#each data.tags as { name, count }}
    <a href="/{name}">
      <span>{name}</span>
      <span>{count}</span>
    </a>
  {/each}
</div>

<style lang="postcss">
  .links > a {
    @apply px-2 py-1 rounded-md hover:bg-neutral-900 transition inline-flex justify-between items-center gap-2 w-full overflow-auto;
  }

  .links > a > span:first-child {
    @apply truncate break-all;
  }

  .links > a > span:last-child {
    @apply text-neutral-400;
  }
</style>
