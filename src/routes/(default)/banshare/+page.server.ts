import api from "$lib/api.js";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ request, locals: { token, user }, fetch }) {
        const data = await request.formData();
        if (!user) return fail(500, { error: "Not Authenticated." });

        const ids = (data.get("ids") as string).trim();
        const reason = (data.get("reason") as string).trim();
        const evidence = (data.get("evidence") as string).trim();
        const server = data.get("server") as string;
        const severity = data.get("severity") as string;
        const urgent = data.has("urgent");

        const values = { ids, reason, evidence, server, severity, urgent };

        const action = (data.get("submit") as string) ?? "Submit";

        const skipValidation = action !== "Submit";
        const skipChecks = action === "Submit Without Checks";

        const req = await api(token, `!POST /banshares`, { ...values, skipValidation, skipChecks });
        const res = await req.json();

        if (!req.ok) return fail(req.status, { error: res.message, ...values });
        return { success: true };
    },
};
