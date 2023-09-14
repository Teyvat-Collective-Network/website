import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ params }) => {
    if (params.id === "new") return { isNew: true, event: { title: "", start: null, end: null, body: "", invites: [] } };

    try {
        return { event: await api(null, `GET /events/${params.id}`) };
    } catch {
        return { error: true };
    }
};
