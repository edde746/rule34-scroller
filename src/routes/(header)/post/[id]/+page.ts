import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(
    `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&id=${params.id}&json=1`
  );
  if (!res.ok) throw error(404, "Post not found");

  return res.json().then((arr) => arr[0]);
};
