import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    throw redirect(303, "/members");
};
