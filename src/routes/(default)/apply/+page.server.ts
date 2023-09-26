import api from "$lib/api.js";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ locals: { token, user }, request }) {
        const data = await request.formData();

        if (!user) return fail(401, { error: "Not Authenticated." });

        const observerchannelconsent = data.has("observerchannelconsent");
        const observerauditconsent = data.has("observerauditconsent");
        const partnerlistconsent = data.has("partnerlistconsent");
        const eventsconsent = data.has("eventsconsent");
        const mascot = (data.get("mascot") as string | null)?.trim();
        const role = data.get("role") as string;
        const roleother = (data.get("roleother") as string | null)?.trim();
        const ownerid = role === "owner" ? "" : (data.get("ownerid") as string | null)?.trim();
        const invite = (data.get("invite") as string | null)?.trim();
        const nsfw = data.get("nsfw") as string;
        const experience = (data.get("experience") as string | null)?.trim()?.replace(/\r\n/, "\n");
        const shortgoals = (data.get("shortgoals") as string | null)?.trim()?.replace(/\r\n/, "\n");
        const longgoals = (data.get("longgoals") as string | null)?.trim()?.replace(/\r\n/, "\n");
        const history = (data.get("history") as string | null)?.trim()?.replace(/\r\n/, "\n");
        const additional = (data.get("additional") as string | null)?.trim()?.replace(/\r\n/, "\n");

        const values = {
            observerchannelconsent,
            observerauditconsent,
            partnerlistconsent,
            eventsconsent,
            mascot,
            role,
            roleother,
            ownerid,
            invite,
            nsfw,
            experience,
            shortgoals,
            longgoals,
            history,
            additional,
        };

        values.ownerid ||= undefined;

        const abort = (message: string) => fail(400, { error: message, ...values });

        const req = await api(token, `!POST /apply`, values);
        if (!req.ok) return abort((await req.json()).message);

        return { success: true };
    },
};
