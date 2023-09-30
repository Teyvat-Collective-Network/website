import bot from "$lib/bot.js";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params: { code } }) => {
    const req = await bot(`!GET /invites/${code}`);

    if (!req.ok) return new Response("{}", { status: 404 });
    return new Response(await req.text());
};
