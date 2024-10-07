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
  import Header from "$lib/Header.svelte";
  import Sorting from "./Sorting.svelte";
  import name from "$lib/name";

  const reset = () => {
    postsInView = [];
    posts = [];
    pageIndex = 0;
    outOfPosts = false;
    resetMasonry();
  };

  const {
    elements: { root, input, tag, deleteTrigger, edit },
    states: { tags },
    helpers: { updateTag, addTag, removeTag },
  } = createTagsInput({
    unique: true,
    defaultTags: $page.params.tags?.length ? $page.params.tags!.split(" ") : [],
    onTagsChange: ({ next }) => {
      reset();

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
  let resetMasonry: () => void;

  let pageIndex = parseInt($page.url.searchParams.get("page") || "0");

  let loading = false,
    outOfPosts = false;

  $: postCount = posts.reduce((count, post) => {
    return errored.includes(post.id) ? count : count + 1;
  }, 0);

  const fetchNextPage = (tagOverwrite?: Tag[]) => {
    if (loading || outOfPosts) return;
    loading = true;

    let query = (tagOverwrite ?? $tags).map((t) => t.value);
    if (!query.some((t) => t.startsWith("sort:"))) query.push("sort:score");

    const params = {
      query: query.join(" "),
      page: pageIndex.toString(),
    };

    fetch(
      `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=50&pid=${params.page}&tags=${params.query}`
    )
      .then((res) => res.json())
      .then((res) => {
        pageIndex++;
        if (res.length == 0) outOfPosts = true;
        else
          posts = [
            ...posts,
            ...res.map((post: any) => ({
              id: post.id,
              sample_url: post.sample_url,
              file_url: post.file_url,
              width: post.width,
              height: post.height,
              tags: post.tags.split(" "),
              source: post.source,
            })),
          ];
      })

      .finally(() => (loading = false));
  };

  onMount(fetchNextPage);

  $: browser &&
    goto(
      `/${encodeURIComponent(
        $tags.length ? $tags.map((t) => t.value).join(" ") : ""
      )}?${new URLSearchParams({
        page: pageIndex.toString(),
      })}`,
      {
        replaceState: true,
        noScroll: true,
        invalidateAll: false,
      }
    );

  let sort: any,
    heights: number[] = [];
</script>

<svelte:window
  on:scroll={() => {
    const triggerPoint = window.innerHeight * 1.6 + window.scrollY;
    if (heights.some((top) => triggerPoint > top)) fetchNextPage();
  }}
/>

<svelte:head>
  {#if $tags.filter((t) => !t.value.startsWith("sort:")).length}
    <title>
      {$tags
        .map((t) => t.value)
        .filter((t) => !t.startsWith("sort:"))
        .join(" ")} - {name($page.url.hostname)}
    </title>
    <meta
      name="description"
      content="Discover thousands of high quality {$tags
        .filter((t) => !t.value.startsWith('sort:'))
        .join(', ')
        .replace(/_/g, ' ')} and more images and videos on {name(
        $page.url.hostname
      )}"
    />
  {:else}
    <title
      >View the best hentai images and videos on {name(
        $page.url.hostname
      )}</title
    >
    <meta
      name="description"
      content="Discover thousands of high quality hentai porn images and videos on {name(
        $page.url.hostname
      )}"
    />
  {/if}
</svelte:head>

<div class="py-4 solid-bg sticky top-0 z-50">
  <Header />
  <div class="flex flex-col md:flex-row gap-2 md:gap-4">
    <div
      use:melt={$root}
      class="w-full z-50 focus:outline-none dark:bg-neutral-900 bg-neutral-200 px-4 py-2 rounded-lg flex gap-2 overflow-x-auto"
    >
      {#each $tags.filter((t) => !t.value.startsWith("sort:")) as t (t.value)}
        <div
          use:melt={$tag(t)}
          class="flex items-center bg-neutral-800 rounded-md pl-1.5 whitespace-nowrap"
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
      <!-- svelte-ignore a11y-autofocus -->

      <input
        autofocus
        use:melt={$input}
        type="text"
        placeholder="Enter tags..."
        class="data-[invalid]:text-red-500 bg-transparent"
      />
    </div>

    <Sorting
      bind:value={sort}
      onSelectedChange={({ next }) => {
        const existingSortTag = $tags.find((t) => t.value.startsWith("sort:"));
        if (next.value == "") existingSortTag && removeTag(existingSortTag);
        else {
          const value = `sort:${next.value}`;
          if (existingSortTag)
            updateTag({
              ...existingSortTag,
              value,
            });
          else addTag(value);
        }
        reset();
        fetchNextPage();
        return next;
      }}
    />
  </div>
</div>

<Masonry items={posts} let:item={post} bind:heights bind:reset={resetMasonry}>
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
