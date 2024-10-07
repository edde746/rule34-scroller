import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  redirect(301, `https://hntai.lol/` + url.toString().split('/').slice(3).join('/'));
};