import api from "$lib/api.js";
import type { Load } from "@sveltejs/kit";

export const load: Load = async () => {
    return await api(null, "GET /stats");
};
