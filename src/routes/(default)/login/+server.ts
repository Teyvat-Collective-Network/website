import { AUTH_REDIRECT, DISCORD_ID } from "$env/static/private";
import { PUBLIC_COOKIE_DOMAIN } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import crypto from "crypto";

export const GET: RequestHandler = async ({ cookies, url }) => {
    const state = crypto.randomBytes(32).toString("hex");
    cookies.set("state", state, { domain: PUBLIC_COOKIE_DOMAIN, path: "/", sameSite: "lax" });
    cookies.set("redirect", url.searchParams.get("redirect") ?? "/", { domain: PUBLIC_COOKIE_DOMAIN, path: "/", sameSite: "lax" });

    throw redirect(
        302,
        `https://discord.com/oauth2/authorize?${new URLSearchParams({
            response_type: "code",
            client_id: DISCORD_ID,
            scope: "identify",
            redirect_uri: AUTH_REDIRECT,
            state,
        })}`,
    );
};
