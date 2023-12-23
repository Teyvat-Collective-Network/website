import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ fetch, locals, params: { id } }) => {
    const req = await api(locals.token, `!GET /short-links/${id}`, undefined, undefined, true, fetch).catch(() => {});

    if (!req.ok) return;
    return { link: await req.text() };
};
