import api from "$lib/api.js";
import bot from "$lib/bot.js";
import type { Handle } from "@sveltejs/kit";

process.on("uncaughtException", console.error);

export const handle: Handle = async ({ event, resolve }) => {
    const { locals, cookies } = event;

    locals.token = cookies.get("token")!;

    if (locals.token) {
        const req = await api(locals.token, `!GET /users/me`);

        if (req.ok) {
            locals.user = await req.json();

            try {
                Object.assign(locals.user, await bot(null, `GET /users/${locals.user.id}/tag`));
            } catch {}
        }
    }

    locals.darkMode = cookies.get("mode") !== "light";

    return await resolve(event);
};
