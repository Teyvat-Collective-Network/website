// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface PageData {
            user: { id: string; guilds: Record<string, string[]>; roles: string[] };
            dark?: boolean;
        }
    }
}

export {};
