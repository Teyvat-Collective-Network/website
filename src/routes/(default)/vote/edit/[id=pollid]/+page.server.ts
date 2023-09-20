import api from "$lib/api.js";
import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ params, locals }) => {
    if (params.id === "new") return { form: {} };

    try {
        return { form: await api(locals.token, `GET /polls/${params.id}`) };
    } catch {
        return {};
    }
};

export const actions: Actions = {
    async default({ params, request, locals }) {
        if (!locals.user.observer) return { error: "You are not authorized." };

        const fail = (error: string) => ({ error, ...data });

        const obj = await request.formData();
        const data: any = {};

        for (const key of ["mode", "question", "server"]) data[key] = obj.get(key) ?? "";
        for (const key of ["preinduct", "live", "restricted", "dm"]) data[key] = !!obj.get(key);
        for (const key of ["quorum", "min", "max", "wave", "seats"]) data[key] = parseInt(obj.get(key) as string);
        data.duration = parseFloat(obj.get("duration") as string);

        if (!["induction", "proposal", "election", "selection"].includes(data.mode)) return fail("Invalid poll mode.");

        if (data.mode === "proposal" || data.mode === "selection") {
            if (!data.question) return fail("No question provided.");
            if (data.question.length > 256) return fail("Question length cannot exceed 256 characters.");
        }

        if (isNaN(data.duration) || data.duration < 0) return fail("Enter a valid duration.");

        if (![0, 60, 75].includes(data.quorum)) return fail("Invalid quorum provided.");

        if (data.mode === "induction") {
            if (!data.server) return fail("No server name provided.");
            if (data.server.length > 32) return fail("Server name cannot exceed 32 characters.");
        } else if (data.mode === "election") {
            if (data.wave === undefined || isNaN(data.wave) || data.wave < 1) return fail("Enter a positive integer for the election wave.");
            if (data.seats === undefined || isNaN(data.seats) || data.seats < 1) return fail("Enter a positive integer for the number of seats.");

            data.candidates = new Array(20)
                .fill(0)
                .map((_, i) => obj.get(`candidate${i}`))
                .filter((x) => x);

            if (data.candidates.length < 1 || data.candidates.length > 20) return fail("1 to 20 candidates required.");
            if (data.candidates.length > new Set(data.candidates).size) return fail("Candidates must be unique.");
        } else if (data.mode === "selection") {
            data.options = new Array(10)
                .fill(0)
                .map((_, i) => (obj.get(`option${i}`) as string | null)?.trim())
                .filter((x) => x);

            if (data.options.length < 2 || data.options.length > 10) return fail("2 to 10 options required.");
            if (data.options.length > new Set(data.options).size) return fail("Options must be unique.");
            if (isNaN(data.min) || data.min < 0) return fail("Enter a non-negative integer for the minimum number of options.");
            if (isNaN(data.max)) return fail("Enter an integer for the maximum number of options.");
            if (data.options.some((x: string) => x.length === 0 || x.length > 100)) return fail("Options must be 1 to 100 characters long.");
        }

        const req = await api(locals.token, params.id === "new" ? `!POST /polls` : `!PUT /polls/${params.id}`, data);
        const res = await req.json();
        if (!req.ok) return fail(res.message);

        return res;
    },
};
