import api from "$lib/api.js";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ request, locals: { token, user }, fetch }) {
        const data = await request.formData();

        if (!user) return fail(401, { error: "Not Authenticated." });

        const values = {
            ids: data.get("ids") as string,
            reason: data.get("reason") as string,
            evidence: data.get("evidence") as string,
            server: data.get("server") as string,
            severity: data.get("severity") as string,
            urgent: data.has("urgent"),
        };

        const action = (data.get("submit") as string) ?? "Submit";

        const req = await api(token, `!POST /banshares`, { ...values, skipValidation: action !== "Submit", skipChecks: action === "Submit Without Checks" });
        if (!req.ok) return fail(400, { error: (await req.json()).message, ...values });

        return { success: true };
    },
};
