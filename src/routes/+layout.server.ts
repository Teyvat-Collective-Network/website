import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ cookies }) => {
    const data: any = {};

    data.token = cookies.get("token") as string;

    if (data.token) {
        const req = await api(data.token, `!/auth/me`);
        if (req.ok) data.user = await req.json();
    }

    data.dark_mode = cookies.get("mode") !== "light";

    return data;
};
