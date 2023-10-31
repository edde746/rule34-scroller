<script lang="ts">
  import { navigating, page } from "$app/stores";
  import { inview } from "svelte-inview";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { Play, X } from "@steeze-ui/lucide-icons";
  import Spinner from "$lib/Spinner.svelte";
  import Masonry from "$lib/Masonry.svelte";
  import { onMount } from "svelte";
  import { createTagsInput, melt } from "@melt-ui/svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  const {
    elements: { root, input, tag, deleteTrigger, edit },
    states: { tags },
  } = createTagsInput({
    unique: true,
    defaultTags: $page.url.searchParams.get("tags")?.split(" ") ?? [],
  });

  let posts: Post[] = [];
  let postsInView: string[] = [];
  let errored: number[] = [];

  let pageIndex = parseInt($page.url.searchParams.get("page") || "1");

  let loading = false,
    outOfPosts = false;

  $: postCount = posts.reduce((count, post) => {
    return errored.includes(post.id) ? count : count + 1;
  }, 0);

  const fetchNextPage = () => {
    if (loading || outOfPosts) return;
    loading = true;

    const params: Record<string, string> = {
      query: $tags.map((t) => t.value).join(" "),
      page: (pageIndex++).toString(),
    };

    fetch(`/posts?${new URLSearchParams(params)}`)
      .then((res) => res.json())
      .then((res) => {
        loading = false;
        if (res.length == 0) outOfPosts = true;
        else posts = [...posts, ...res];
      });
  };

  onMount(() => {
    fetchNextPage();
    tags.subscribe(() => {
      postsInView = [];
      posts = [];
      pageIndex = 1;
      outOfPosts = false;
      fetchNextPage();
    });
  });

  // $: browser &&
  //   goto(`?tags=${$tags.map((t) => t.value).join(" ")}&page=${pageIndex - 1}`, {
  //     replaceState: true,
  //     noScroll: true,
  //     invalidateAll: false,
  //   });
</script>

<svelte:window
  on:scroll={() => {
    if (window.innerHeight * 1.6 + window.scrollY >= document.body.offsetHeight)
      fetchNextPage();
  }}
/>

<svelte:head>
  <title>r34-scroller</title>
  <meta
    name="description"
    content="Discover the latest memes, pictures, videos, and more from r/{$page
      .params.subreddit} with rscroll.app, an infinite Reddit scroll viewer."
  />
</svelte:head>

<div class="max-w-5xl mx-auto px-4">
  <div class="py-4 solid-bg sticky top-0 z-50">
    <div
      use:melt={$root}
      class="w-full z-50 focus:outline-none dark:bg-neutral-900 bg-neutral-200 px-4 py-2 rounded-lg flex gap-2"
    >
      {#each $tags as t}
        <div
          use:melt={$tag(t)}
          class="flex items-center bg-neutral-800 rounded-md pl-1.5"
        >
          <span>
            {t.value}
          </span>
          <button
            use:melt={$deleteTrigger(t)}
            class="flex h-full items-center rounded-md px-1.5 hover:opacity-90"
          >
            <Icon src={X} class="w-3 h-3" />
          </button>
        </div>
        <div
          use:melt={$edit(t)}
          class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500"
        />
      {/each}
      <input
        use:melt={$input}
        type="text"
        placeholder="Enter tags..."
        class="data-[invalid]:text-red-500 bg-transparent"
      />
    </div>
  </div>
  <Masonry items={posts} let:item={post} let:index={i}>
    {#if post}
      <a
        style="aspect-ratio: {post.width}/{post.height}"
        href={post.file_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
        {#if post.file_url.endsWith(".mp4")}
          <div
            class="inset-0 absolute backdrop-blur-[2px] flex items-center justify-center z-30"
          >
            <Icon
              src={Play}
              class="w-16 h-16 text-neutral-100 drop-shadow-md"
            />
          </div>
          <img
            src={post.sample_url}
            alt={post.tags.join(", ")}
            class="media"
            loading="lazy"
            on:error={() => (errored = [...errored, post.id])}
          />
        {:else}
          <img
            src={post.sample_url}
            alt={post.tags.join(", ")}
            class="media"
            loading="lazy"
            on:error={() => (errored = [...errored, post.id])}
          />
        {/if}
      </a>
    {/if}
  </Masonry>
</div>

{#if loading}
  <div class="flex w-full justify-center my-5">
    <Spinner fill="white" />
  </div>
{:else if outOfPosts || postCount == 0}
  <div class="flex w-full justify-center my-5 text-lg">No more posts</div>
{/if}

<style>
  .media {
    @apply w-full mb-4 absolute inset-0 z-10;
  }

  a {
    @apply w-full relative block;
  }
</style>
