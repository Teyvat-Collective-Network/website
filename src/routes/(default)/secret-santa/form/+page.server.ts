import api from "$lib/api.js";
import { mdToHtml } from "$lib/server-utils.js";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
    const { token, user } = locals;
    if (!user) return;

    const data = await api(token, `GET /secret-santa/data`);

    if (data.status === "locked-sender") {
        try {
            data.partnerInfo = await mdToHtml((await api(token, `GET /secret-santa/partner-data`)).info);
        } catch (error) {
            data.error = error;
        }
    }

    return { ...data, ...locals };
};

export const actions: Actions = {
    initialize: async ({ locals: { token }, request }) => {
        const data = await request.formData();

        if (data.get("submit") === "Lock In") {
            const req = await api(token, `!POST /secret-santa/lock-in`, { info: data.get("info") });
            if (req.status === 201) return { error: "Too many people are signing up at once. Please wait a bit and try again soon! Your info was saved." };
            return {};
        } else {
            await api(token, `POST /secret-santa/save-data`, { info: data.get("info") });
            return { success: "Your info has been saved!" };
        }
    },
    prove: async ({ locals: { token }, request }) => {
        const data = await request.formData();

        const req = await api(token, `!POST /secret-santa/prove`, { proof: data.get("proof") });
        if (!req.ok) return { error: (await req.json()).message };
        return { success: "Your proof has been submitted! Please be patient while we review your information." };
    },
    bail: async ({ locals: { token } }) => {
        const req = await api(token, `!POST /secret-santa/bail`);
        if (!req.ok) return { error: (await req.json()).message };
        return { success: "You have forfeited this transaction." };
    },
};
