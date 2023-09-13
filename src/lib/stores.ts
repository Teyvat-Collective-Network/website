import { writable } from "svelte/store";
import type { User } from "./types.js";

export const dark_mode = writable<boolean>(true);
export const token = writable<string>();
export const user = writable<User | undefined>();
