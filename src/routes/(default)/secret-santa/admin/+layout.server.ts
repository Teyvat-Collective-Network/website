import api from "$lib/api.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
    return { ...locals, isSecretSantaAdmin: await api(locals.token, `GET /secret-santa/is-admin`) };
};
