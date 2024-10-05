<script>
  import { onMount } from "svelte";
  import "../app.postcss";

  let unlocked = true;

  onMount(() => {
    unlocked = localStorage.getItem("unlocked") === "true";
  });
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CDWGY2LDKQ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-CDWGY2LDKQ");
  </script>
</svelte:head>

{#if !unlocked}
  <div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center text-center z-[9999]">
    <div class="bg-neutral-900/50 p-6 rounded-xl flex flex-col items-center">
      <div class="max-w-sm">
        <h1 class="text-2xl font-bold">Are you 18 or older?</h1>
        <p class="text-neutral-200">This site contains adult content and is intended for adults aged 18 or over.</p>
      </div>

      <div class="flex gap-2 mt-4">
        <a href="https://www.google.com/" rel="noopener noreferrer" class="pill bg-blue-500"> No </a>
        <button
          on:click={() => {
            localStorage.setItem("unlocked", "true");
            unlocked = true;
          }}
          class="pill bg-neutral-900"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
{/if}

<div class="max-w-5xl mx-auto px-4">
  <slot />
</div>

<style>
  .pill {
    @apply px-8 py-2 text-lg;
  }
</style>
