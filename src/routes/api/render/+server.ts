import { mdToHtml } from "$lib/server-utils.js";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    return new Response(await mdToHtml(await request.text()));
};
