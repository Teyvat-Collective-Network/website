import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ params }) => {
    if (params.id === "new") return { isNew: true, event: { invites: [] } };

    try {
        return { event: await api(null, `GET /events/${params.id}`) };
    } catch {
        return { error: true };
    }
};
