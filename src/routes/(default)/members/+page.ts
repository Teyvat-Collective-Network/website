import api from "$lib/api.js";
import type { Guild } from "$lib/types";
import type { Load } from "@sveltejs/kit";

export const load: Load = async () => {
    return { partners: ((await api(null, `GET /guilds`)) as Guild[]).sort((x, y) => x.name.localeCompare(y.name)) };
};
