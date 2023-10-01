import bot from "$lib/bot.js";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals: { token }, params: { id } }) => {
    const req = await bot(token, `!GET /users/${id}/tag`);

    if (!req.ok) return new Response("");
    return new Response(await req.json());
};
