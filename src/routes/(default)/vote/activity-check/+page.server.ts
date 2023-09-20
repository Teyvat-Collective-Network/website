import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
    return { data: await api(locals.token, `GET /polls/activity-check`) };
};
