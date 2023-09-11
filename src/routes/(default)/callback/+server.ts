import { DISCORD_ID, DISCORD_SECRET, JWT_SECRET } from "$env/static/private";
import { PUBLIC_COOKIE_DOMAIN, PUBLIC_DOMAIN } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import crypto from "crypto";

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

    const now = Date.now();
    const expires = now + 30 * 24 * 60 * 60 * 1000;

    const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({ id: user.id, created: now, expires }), "utf8").toString("base64url")}`;
    const hash = crypto.createHmac("sha256", JWT_SECRET).update(jwt, "utf8").digest("base64url");
    cookies.set("token", `${jwt}.${hash}`, { domain: PUBLIC_COOKIE_DOMAIN, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/", sameSite: "lax" });

    throw redirect(302, target);
};
