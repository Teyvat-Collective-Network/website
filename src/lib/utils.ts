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

export function listJoin(items: any[], separator = "and"): string {
    if (items.length === 0) return "";
    if (items.length === 1) return `${items[0]}`;
    if (items.length === 2) return `${items[0]} ${separator} ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, ${separator} ${items.at(-1)}`;
}
