import api from "$lib/api.js";
import di from "$lib/di.js";
import type { User } from "$lib/types.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ cookies }) => {
    const data: { token?: string; user?: User; dark_mode?: boolean } = {};

    data.token = cookies.get("token") as string;

    if (data.token) {
        const req = await api(data.token, `!GET /auth/me`);
        if (req.ok) {
            data.user = await req.json();

            try {
                Object.assign(data.user!, await di(`GET /user/${data.user!.id}`));
            } catch {}
        }
    }

    data.dark_mode = cookies.get("mode") !== "light";

    return data;
};
