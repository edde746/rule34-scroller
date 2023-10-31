import { type RequestHandler, json, error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const page = Number(url.searchParams.get("page")) || 0;
  const query = url.searchParams.get("query") || "";

  const posts = await fetch(
    `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&pid=${page}&tags=${query}`
  );

  if (!posts.ok) throw error(posts.status, await posts.text());

  return json(
    (await posts.json()).map((post: any) => ({
      id: post.id,
      sample_url: post.sample_url,
      file_url: post.file_url,
      width: post.width,
      height: post.height,
      tags: post.tags.split(" "),
      source: post.source,
    }))
  );
};
