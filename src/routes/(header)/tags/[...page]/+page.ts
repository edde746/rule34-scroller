import type { PageLoad } from "./$types";
import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser({
  ignoreAttributes: false,
});

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(
    `https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&pid=${
      Number(params.page || 1) - 1
    }&limit=100`
  );

  const xml = await res.text();
  const json = parser.parse(xml);

  return {
    tags: json.tags.tag.map((tag: any) => ({
      name: tag["@_name"],
      count: tag["@_count"],
    })),
  };
};
