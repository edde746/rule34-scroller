<script lang="ts">
  import { Icon } from "@steeze-ui/svelte-icon";
  import { X } from "@steeze-ui/lucide-icons";
  import Spinner from "$lib/Spinner.svelte";
  import Masonry from "$lib/Masonry.svelte";
  import { onMount } from "svelte";
  import { createTagsInput, melt, type Tag } from "@melt-ui/svelte";
  import Post from "./Post.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";

  const {
    elements: { root, input, tag, deleteTrigger, edit },
    states: { tags },
  } = createTagsInput({
    unique: true,
    defaultTags: $page.url.searchParams.get("tags")?.length
      ? $page.url.searchParams.get("tags")!.split(" ")
      : [],
    onTagsChange: ({ curr, next }) => {
      postsInView = [];
      posts = [];
      pageIndex = 1;
      outOfPosts = false;

      const targetTags = next.map((t) => ({
        ...t,
        value: t.value.toLowerCase().replace(/ /g, "_"),
      }));

      fetchNextPage(targetTags);
      return targetTags;
    },
  });

  let posts: Post[] = [];
  let postsInView: string[] = [];
  let errored: number[] = [];

  let pageIndex = parseInt($page.url.searchParams.get("page") || "0");

  let loading = false,
    outOfPosts = false;

  $: postCount = posts.reduce((count, post) => {
    return errored.includes(post.id) ? count : count + 1;
  }, 0);

  const fetchNextPage = (tagOverwrite?: Tag[]) => {
    if (loading || outOfPosts) return;
    loading = true;

    const params: Record<string, string> = {
      query: (tagOverwrite ?? $tags).map((t) => t.value).join(" "),
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

  onMount(fetchNextPage);

  $: browser &&
    goto(
      `?${new URLSearchParams({
        tags: $tags.length ? $tags.map((t) => t.value).join(" ") : "",
        page: (pageIndex - 1).toString(),
      })}`,
      {
        replaceState: true,
        noScroll: true,
        invalidateAll: false,
      }
    );
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

<div class="py-4 solid-bg sticky top-0 z-50">
  <div
    use:melt={$root}
    class="w-full z-50 focus:outline-none dark:bg-neutral-900 bg-neutral-200 px-4 py-2 rounded-lg flex gap-2 overflow-x-auto"
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
    <Post on:error={() => (errored = [...errored, post.id])} {post} />
  {/if}
</Masonry>

{#if loading}
  <div class="flex w-full justify-center my-5">
    <Spinner fill="white" />
  </div>
{:else if outOfPosts || postCount == 0}
  <div class="flex w-full justify-center my-5 text-lg">No more posts</div>
{/if}
