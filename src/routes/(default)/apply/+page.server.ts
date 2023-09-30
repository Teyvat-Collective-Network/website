import api from "$lib/api.js";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ locals: { token, user }, request }) {
        const data = await request.formData();

        if (!user) return fail(401, { error: "Not Authenticated." });

        const role = data.get("role") as string;

        const values = {
            observerchannelconsent: data.has("observerchannelconsent"),
            observerauditconsent: data.has("observerauditconsent"),
            partnerlistconsent: data.has("partnerlistconsent"),
            eventsconsent: data.has("eventsconsent"),
            mascot: (data.get("mascot") as string | null)?.trim(),
            role,
            roleother: (data.get("roleother") as string | null)?.trim(),
            ownerid: role === "owner" ? "" : (data.get("ownerid") as string | null)?.trim(),
            invite: (data.get("invite") as string | null)?.trim(),
            nsfw: data.get("nsfw") as string,
            experience: (data.get("experience") as string | null)?.trim()?.replace(/\r\n/, "\n"),
            shortgoals: (data.get("shortgoals") as string | null)?.trim()?.replace(/\r\n/, "\n"),
            longgoals: (data.get("longgoals") as string | null)?.trim()?.replace(/\r\n/, "\n"),
            history: (data.get("history") as string | null)?.trim()?.replace(/\r\n/, "\n"),
            additional: (data.get("additional") as string | null)?.trim()?.replace(/\r\n/, "\n"),
        };

        values.ownerid ||= undefined;

        const req = await api(token, `!POST /apply`, values);
        if (!req.ok) return fail(400, { error: (await req.json()).message, ...values });

        return { success: true };
    },
};
