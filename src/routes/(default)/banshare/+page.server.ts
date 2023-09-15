import api from "$lib/api.js";
import { user } from "$lib/stores.js";
import type { Guild } from "$lib/types.js";
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
        if (!server) return abort(400, "You must select a server.");
        if (!severity) return abort(400, "You must select the severity.");

        if (!severity.match(/^P[0-2]|DM$/)) return abort(400, "Invalid severity (P0-2, DM).");

        if (reason.length > 498) return abort(400, "Maximum reason length is 498 characters.");
        if (evidence.length > 1000) return abort(400, "Maximum evidence length is 1000 characters.");

        const guild = locals.user.guilds[server];
        if (!guild) return abort(400, "Invalid server selected.");
        if (!guild.owner && !guild.advisor && (!guild.staff || !guild.roles.includes("banshares")))
            return abort(400, "You are not authorized to submit banshares from the selected server.");

        const { name } = await api(locals.token, `GET /guilds/${server}`);
    },
};
