// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/types.js";

// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            token: string;
            user: User;
            darkMode: boolean;
        }

        interface PageData {
            token: string;
            user: User;
            darkMode: boolean;
        }
    }
}

export {};
