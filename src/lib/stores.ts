import { writable } from "svelte/store";
import type { User } from "./types.js";

export const darkMode = writable<boolean>(true);
export const token = writable<string>();
export const user = writable<User | undefined>();

export const alerts = {
    copy: writable<number>(0),
    save: writable<number>(0),
    nodelete: writable<number>(0),
    nomore: writable<number>(0),
};

export const modals = {
    audit: writable<boolean>(false),
};

export const auditRequired = writable<boolean>(false);
export const auditMessage = writable<string>("");
export const auditReason = writable<string | null | undefined>();

export const tags = writable<Record<string, string | null>>({});
