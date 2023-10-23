import api from "$lib/api.js";
import type { Load } from "@sveltejs/kit";
import { Guild } from "../../../lib/types.js";

export const load: Load = async () => {
    return { partners: ((await api(null, `GET /guilds`)) as Guild[]).sort((x, y) => x.name.localeCompare(y.name)) };
};
