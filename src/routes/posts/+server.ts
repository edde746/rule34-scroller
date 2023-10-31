import { RequestHandler, json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const page = Number(url.searchParams.get("page")) || 0;
  const query = url.searchParams.get("query") || "";

  const posts = await fetch(
    `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=50&pid=${page}&tags=${query}`
  )
    .then((res) => res.json())
    .catch(() => []);

  return json(
    posts.map((post) => ({
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
