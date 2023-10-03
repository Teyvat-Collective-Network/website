import { auditMessage, auditReason, auditRequired, modals, token } from "./stores.js";

declare const hljs: any;

const tags: Record<string, string | null> = {};
const loading = new Set<string>();
const waiting: Record<string, any[]> = {};

let key: string = "";
token.subscribe((x) => (key = x));

export const patterns = {
    snowflake: "^[1-9][0-9]{16,19}$",
    id: "^[a-z\\-]{1,32}$",
};

export async function getTag(id: string): Promise<string | null> {
    if (id in tags) return tags[id];

    if (!loading.has(id)) {
        loading.add(id);

        const req = await fetch(`/api/tag/${id}`);
        tags[id] = await req.text();

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

export function without<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function swap<T>(array: T[], i: number, j: number): T[] {
    return [
        ...array.slice(0, Math.min(i, j)),
        array[Math.max(i, j)],
        ...array.slice(Math.min(i, j) + 1, Math.max(i, j)),
        array[Math.min(i, j)],
        ...array.slice(Math.max(i, j) + 1),
    ];
}

export function debounce<T extends any[], U>(fn: (...args: T) => U, timeout: number = 500): (...args: T) => void {
    let timer: NodeJS.Timeout;

    return (...args: T) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), timeout);
    };
}

export function highlight(depth = 0) {
    try {
        hljs.configure({ ignoreUnescapedHTML: true });
        hljs.highlightAll();
    } catch {
        if (depth < 10) setTimeout(() => highlight(depth + 1), 250);
    }
}

export async function withAudit<T extends boolean>(message: string, fn: (reason: T extends true ? string : string | null) => any, required: T) {
    auditRequired.set(required);
    auditMessage.set(message);
    auditReason.set(undefined);
    modals.audit.set(true);

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            let first = true;

            const unsubscribe = auditReason.subscribe(async (reason) => {
                if (first) {
                    first = false;
                    return;
                }

                try {
                    if (reason !== null && (!required || reason)) await fn(reason || (null as any));
                } catch (error) {
                    reject(error);
                    return;
                }

                modals.audit.set(false);
                unsubscribe();
                resolve(reason);
            });
        });
    });
}
