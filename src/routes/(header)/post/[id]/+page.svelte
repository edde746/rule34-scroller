<script lang="ts">
  import { Icon } from "@steeze-ui/svelte-icon";
  import type { PageData } from "./$types";
  import { ArrowUp, ExternalLink } from "@steeze-ui/lucide-icons";

  export let data: PageData;
  let imageHeight: number;

  $: sourceDomain = data.source ? new URL(data.source).hostname : undefined;
</script>

<svelte:head>
  <title>Post #{data.id} - hntai.lol</title>
  <meta
    name="description"
    content="View post #{data.id} with tags like {data.tags
      .split(' ')
      .sort((a, b) => Math.random() - 0.5)
      .slice(0, 5)
      .join(', ')
      .replace(/_/g, ' ')} and more hentai images and videos on hntai.lol"
  />
</svelte:head>

<div
  class="media bg-neutral-900 absolute left-0"
  bind:clientHeight={imageHeight}
>
  {#if data.file_url.endsWith(".mp4")}
    <div
      class="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
    >
      <a
        href={data.file_url}
        class="pill gap-2 items-center"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icon src={ExternalLink} class="w-4 h-4" />
        <span>Play in new tab</span>
      </a>
    </div>
    <img src={data.sample_url} alt={data.tags} />
  {:else}
    <img src={data.file_url} alt={data.tags} />
  {/if}
</div>
<div style="height:{imageHeight}px" />

<div class="my-4 flex flex-wrap gap-3">
  <div class="pill items-center gap-2 pointer-events-none">
    <Icon src={ArrowUp} class="w-5 h-5" />
    <span>{data.score}</span>
  </div>
  <a
    class="pill items-center gap-2"
    href={data.source}
    rel="noopener noreferrer"
  >
    <img
      alt="sourceDomain"
      src="https://www.google.com/s2/favicons?domain={sourceDomain}&sz=512"
      class="w-4 h-4 object-contain object-center"
    />
    <span>Source</span>
  </a>
</div>

<h2 class="text-lg font-semibold">Tags</h2>

<div class="my-4 flex flex-wrap gap-3">
  {#each data.tags.split(" ") as tag}
    <a class="pill" href="/{tag}">
      {tag.replace(/_/g, " ")}
    </a>
  {/each}
</div>

<style lang="postcss">
  .media > * {
    @apply w-screen object-contain object-center;
    max-height: 80vh;
  }
</style>
