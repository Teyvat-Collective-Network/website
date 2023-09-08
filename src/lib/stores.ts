import { writable } from "svelte/store";
import type { User } from "./types.js";

export const dark_mode = writable<boolean>(true);
export const token = writable<string>();
export const user = writable<User | undefined>();
export const observer = writable<boolean>(false);
export const owner = writable<boolean>(false);
export const advisor = writable<boolean>(false);
export const council = writable<boolean>(false);

user.subscribe((x) => {
    let v1: boolean, v2: boolean, v3: boolean;

    observer.set((v1 = !!x && x.roles.includes("observer")));
    owner.set((v2 = !!x && x.roles.includes("owner")));
    advisor.set((v3 = !!x && x.roles.includes("advisor")));

    council.set(v1 || v2 || v3);
});
