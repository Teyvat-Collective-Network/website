import api from "$lib/api.js";
import { mdToHtml } from "$lib/server-utils.js";
import type { TCNDoc } from "$lib/types.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals: { token, user }, params: { id } }) => {
    try {
        const data: { doc: TCNDoc; parsed: string | null } = { doc: await api(token, `GET /docs/${id}`), parsed: null };

        try {
            data.parsed = await mdToHtml(data.doc.body, user?.id);
        } catch {}

        return data;
    } catch {
        return { fail: true };
    }
};
