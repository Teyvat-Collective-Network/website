import { PUBLIC_API } from "$env/static/public";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ request, cookies }) => {
    const data: any = {};
    const token = request.headers.get("authorization") || cookies.get("token");

    if (token) {
        const req = await fetch(`${PUBLIC_API}/auth/user`);
        if (req.ok) data.user = await req.json();
    }

    data.dark = cookies.get("mode") !== "light";

    return data;
};
