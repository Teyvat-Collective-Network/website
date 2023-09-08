import { PUBLIC_COOKIE_DOMAIN } from "$env/static/public";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, url }) => {
    cookies.delete("token", { domain: PUBLIC_COOKIE_DOMAIN, path: "/", sameSite: "lax" });
    return new Response();
};
