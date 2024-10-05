<script>
  import name from "./name";
  import { page } from "$app/stores";
  import { CircleHelp, House, Tag } from "@steeze-ui/lucide-icons";
  import { Icon } from "@steeze-ui/svelte-icon";
</script>

<div class="flex justify-between items-center mb-2">
  <h1 class="font-semibold">{name($page.url.hostname)}</h1>
  <nav>
    <a href="/">
      <Icon src={House} class="w-4 h-4" />
      <span>Home</span>
    </a>
    <a href="/tags">
      <Icon src={Tag} class="w-4 h-4" />
      <span>Tags</span>
    </a>
    <a href="/guide">
      <Icon src={CircleHelp} class="w-4 h-4" />
      <span>Guide</span>
    </a>
  </nav>
</div>

<style lang="postcss">
  nav > a {
    @apply px-2 py-1 rounded-md hover:bg-neutral-900 transition inline-flex items-center gap-2;
  }
</style>
