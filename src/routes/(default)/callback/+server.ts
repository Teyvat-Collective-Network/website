import { DISCORD_ID, DISCORD_SECRET, PRIVATE_API } from "$env/static/private";
import { PUBLIC_COOKIE_DOMAIN, PUBLIC_DOMAIN } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, fetch, url }) => {
    const state = cookies.get("state");
    const target = cookies.get("redirect") ?? "/";

    if (!state || state !== url.searchParams.get("state")) return new Response("Invalid or missing state.", { status: 401 });

    const t_req = await fetch(`https://discord.com/api/v10/oauth2/token`, {
        method: "post",
        body: new URLSearchParams({
            client_id: DISCORD_ID,
            client_secret: DISCORD_SECRET,
            code: url.searchParams.get("code")!,
            redirect_uri: `${PUBLIC_DOMAIN}/callback`,
            grant_type: "authorization_code",
        }),
    });

    if (!t_req.ok) return new Response("Invalid code.", { status: 401 });

    const tokens = await t_req.json();
    if (!tokens) return new Response("Invalid code.", { status: 401 });

    const u_req = await fetch(`https://discord.com/api/v10/users/@me`, { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!u_req.ok) return new Response("Invalid token.", { status: 401 });

    const user = await u_req.json();

    const req = await fetch(`${PRIVATE_API}/login/${user.id}`);
    if (!req.ok) return new Response("Unexpected error signing a login token.", { status: 500 });

    cookies.set("token", await req.text(), { domain: PUBLIC_COOKIE_DOMAIN, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/", sameSite: "lax" });

    throw redirect(302, target);
};
