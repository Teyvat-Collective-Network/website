import api from "$lib/api.js";
import { mdToHtml } from "$lib/server-utils.js";
import type { CalendarEvent } from "$lib/types.js";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async () => {
    const events: CalendarEvent[] = await api(null, `GET /events`);

    for (const event of events)
        try {
            event.body = await mdToHtml(event.body);
        } catch {
            event.body = "";
        }

    return { events };
};
