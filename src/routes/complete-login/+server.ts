import { PUBLIC_API, PUBLIC_COOKIE_DOMAIN } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, fetch, url }) => {
    const token = url.searchParams.get("token");
    if (!token) return new Response("Missing token.", { status: 401 });

    const req = await fetch(`${PUBLIC_API}/auth/token`, { headers: { authorization: token } });
    if (!req.ok) return new Response("Invalid token.", { status: 401 });

    cookies.set("token", token, { domain: PUBLIC_COOKIE_DOMAIN, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/", sameSite: "lax" });
    throw redirect(302, url.searchParams.get("redirect") ?? "/");
};
