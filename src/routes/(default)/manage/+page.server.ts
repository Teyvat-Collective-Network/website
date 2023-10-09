import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals: { user } }) => {
    if (!user.observer && Object.keys(user.guilds).length === 1) throw redirect(303, `/manage/${Object.keys(user.guilds)[0]}`);
};
