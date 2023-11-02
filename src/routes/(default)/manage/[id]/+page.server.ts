import bot from "$lib/bot.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals: { token, user }, params: { id } }) => {
    if (user.observer || user.guilds[id!]?.council) return { roles: await bot(token, `GET /guilds/${id}/roles`) };
    return { roles: {} };
};
