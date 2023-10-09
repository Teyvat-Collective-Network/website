import { PUBLIC_COOKIE_DOMAIN, PUBLIC_DISCORD_ID, PUBLIC_DOMAIN } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import crypto from "crypto";

export const GET: RequestHandler = async ({ cookies, setHeaders, url }) => {
    const state = crypto.randomBytes(32).toString("hex");

    cookies.set("state", state, { domain: PUBLIC_COOKIE_DOMAIN, path: "/", sameSite: "lax" });
    cookies.set("redirect", url.searchParams.get("redirect") ?? "/", { domain: PUBLIC_COOKIE_DOMAIN, path: "/", sameSite: "lax" });

    throw redirect(
        303,
        `https://discord.com/oauth2/authorize?${new URLSearchParams({
            response_type: "code",
            client_id: PUBLIC_DISCORD_ID,
            scope: "identify",
            redirect_uri: `${PUBLIC_DOMAIN}/callback`,
            state,
        })}`,
    );
};
