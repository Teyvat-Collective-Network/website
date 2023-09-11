import api from "$lib/api.js";
import type { Load } from "@sveltejs/kit";

export const load: Load = async () => {
    return { partners: await api(null, `GET /guilds`) };
};
