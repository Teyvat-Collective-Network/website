import api from "$lib/api.js";
import di from "$lib/di.js";
import { fail, type Actions } from "@sveltejs/kit";

function compare(a: string, b: string): number {
    if (!a.match(/^\d+$/))
        if (!b.match(/^\d+$/)) return a.localeCompare(b);
        else return -1;
    else if (!b.match(/^\d+$/)) return 1;

    const diff = BigInt(a) - BigInt(b);
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

const severities: Record<string, string> = {
    P0: "P0 (Critical)",
    P1: "P1 (Medium)",
    P2: "P2 (Low)",
    DM: "DM Scam",
};

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

        const action = (data.get("submit") as string) ?? "Submit";

        const skipValidation = action !== "Submit";
        const skipChecks = action === "Submit Without Checks";

        const req = await api(token, `POST /banshares`, { ids, reason, evidence, server, severity, urgent, skipValidation, skipChecks });
        console.log(req.status, await req.json());

        return { success: true };
    },
};
