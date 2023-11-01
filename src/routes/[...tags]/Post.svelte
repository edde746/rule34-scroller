<script lang="ts">
  import { ExternalLink, Info, Play, Search } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";

  export let post: Post;
</script>

<article
  class="w-full relative block group overflow-hidden"
  style="aspect-ratio: {post.width}/{post.height}"
>
  <div
    class="absolute inset-x-0 bottom-0 flex w-full z-20 group-focus-within:opacity-100 group-hover:opacity-100 opacity-0 transition-opacity duration-200 ease-in-out"
  >
    <a
      href={post.file_url}
      target="_blank"
      rel="noopener noreferrer"
      class="bg-purple-500 flex items-center justify-center w-full"
    >
      <Icon src={ExternalLink} class="w-4 h-4 text-neutral-100" />
    </a>
    <a
      href="https://saucenao.com/search.php?url={encodeURI(post.file_url)}"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-blue-500 flex items-center justify-center w-full"
    >
      <Icon src={Search} class="w-4 h-4 text-neutral-100" />
    </a>
    <a
      href="/post/{post.id}"
      target="_blank"
      class="bg-sky-500 flex items-center justify-center w-full p-2"
    >
      <Icon src={Info} class="w-4 h-4 text-neutral-100" />
    </a>
  </div>

  <div class="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 -z-10" />
  {#if post.file_url.endsWith(".mp4")}
    <div class="inset-0 absolute p-2 top-0 left-0 z-10">
      <Icon src={Play} class="w-6 h-6 text-neutral-100 play-button" />
    </div>
    <img
      src={post.sample_url}
      alt={post.tags.join(", ")}
      loading="lazy"
      on:error
    />
  {:else}
    <img
      src={post.sample_url}
      alt={post.tags.join(", ")}
      loading="lazy"
      on:error
    />
  {/if}
</article>

<style>
  img {
    @apply w-full mb-4 absolute inset-0 z-10;
  }
</style>
