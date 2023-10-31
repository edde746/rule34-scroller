import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const res = await fetch(
    `https://rule34.xxx/public/autocomplete.php?q=${url.searchParams.get("q")}`
  );
  if (!res.ok) throw error(res.status, await res.text());
  const data = await res.json();
  return json(data, {
    headers: {
      "cache-control": "public, max-age=86400",
    },
  });
};
