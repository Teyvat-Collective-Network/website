import { WEBHOOK_OBSERVER_GALLERY, WEBHOOK_SUMMARIES } from "$env/static/private";
import api from "$lib/api.js";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals: { token }, params: { id } }) => {
    const user = await api(token, `GET /users/me`);
    if (!user.observer) return new Response("");

    return new Response(
        {
            summaries: WEBHOOK_SUMMARIES,
            "observer-gallery": WEBHOOK_OBSERVER_GALLERY,
        }[id!],
    );
};
