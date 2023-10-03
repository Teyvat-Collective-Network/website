import api from "$lib/api.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ locals: { token }, request }) {
        const data = await request.formData();

        const id = data.get("id");
        const reason = ((data.get("reason") as string) ?? "").trim();

        const values = {
            name: data.get("name"),
            mascot: data.get("mascot"),
            invite: data.get("invite"),
            owner: data.get("owner"),
            advisor: data.get("advisor") || null,
            delegated: data.has("delegated"),
        };

        try {
            await api(token, `POST /guilds/${id}`, values, reason);
        } catch (error) {
            return { error, id, ...values, reason };
        }

        throw redirect(303, `/admin/api-manager/guilds/${id}`);
    },
};
