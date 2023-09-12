import api from "./api.js";
import { token } from "./stores.js";

const tags: Record<string, string | null> = {};
const loading = new Set<string>();
const waiting: Record<string, any[]> = {};

let key: string = "";
token.subscribe((x) => (key = x));

export async function getTag(id: string): Promise<string | null> {
    if (id in tags) return tags[id];

    if (!loading.has(id)) {
        loading.add(id);

        tags[id] = await api(key, `GET /tag/${id}`);
        waiting[id]?.forEach((r) => r(tags[id]));

        delete waiting[id];

        return tags[id];
    }

    waiting[id] ??= [];
    return new Promise((r) => waiting[id].push(r));
}
