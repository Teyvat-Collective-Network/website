import api from "$lib/api.js";
import di from "$lib/di.js";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const { locals, cookies } = event;

    locals.token = cookies.get("token")!;

    if (locals.token) {
        const req = await api(locals.token, `!GET /auth/me`);

        if (req.ok) {
            locals.user = await req.json();

            try {
                Object.assign(locals.user, await di(`GET /user/${locals.user.id}`));
            } catch {}
        }
    }

    locals.dark_mode = cookies.get("mode") !== "light";

    return await resolve(event);
};
