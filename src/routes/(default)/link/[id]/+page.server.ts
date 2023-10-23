import api from "$lib/api.js";
import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ fetch, locals, params: { id } }) => {
    const data = await api(locals.token, `GET /short-links/${id}`, undefined, undefined, true, fetch).catch(() => {});

    if (!data) return;
    throw redirect(303, data);
};
