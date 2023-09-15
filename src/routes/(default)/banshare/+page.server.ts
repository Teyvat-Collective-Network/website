import { user } from "$lib/stores.js";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ request, locals, fetch }) {
        const data = await request.formData();
        if (!locals.user) return fail(500, { error: "Not Authenticated." });

        const ids = (data.get("ids") as string).trim();
        const reason = (data.get("reason") as string).trim();
        const evidence = (data.get("evidence") as string).trim();
        const server = data.get("server") as string;
        const severity = data.get("severity") as string;
        const urgent = data.has("urgent");

        const action = (data.get("submit") as string) ?? "Submit";

        const values = { ids, reason, evidence, server, severity, urgent };

        const abort = (code: number, message: string) => fail(code, { error: message, ...values });

        if (ids.length === 0) return abort(400, "You must enter at least one user to banshare.");

        if (!reason) return abort(400, "You must enter a reason.");
        if (!evidence) return abort(400, "You must enter some evidence.");
    },
};
