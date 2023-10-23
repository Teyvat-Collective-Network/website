import api from "$lib/api.js";
import { zip } from "$lib/zip.js";
import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ fetch, locals, params: { id } }) => {
    const data = await api(locals.token, `GET /share-links/${id}`, undefined, undefined, fetch).catch(() => {});

    if (!data) return;
    throw redirect(303, `/tools/embeds?data=${zip(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")}`);
};
