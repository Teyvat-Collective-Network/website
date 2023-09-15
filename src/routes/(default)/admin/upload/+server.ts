import api from "$lib/api.js";
import { responseToReadable } from "$lib/server-utils.js";
import type { Cookies, RequestHandler } from "@sveltejs/kit";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";

export async function _pre(cookies: Cookies): Promise<Response | undefined> {
    const token = cookies.get("token");

    if (!token) return new Response("", { status: 401 });

    const req = await api(token, "!GET /auth/me");
    if (!req.ok) return new Response("", { status: 401 });

    const res = await req.json();
    if (!res.observer) return new Response("", { status: 403 });
}

export const POST: RequestHandler = async ({ cookies, url }) => {
    const fail = await _pre(cookies);
    if (fail) return fail;

    const file = url.searchParams.get("file")!;
    const src = url.searchParams.get("url")!;

    if (file.includes("/")) return new Response("", { status: 403 });

    try {
        const req = await fetch(src);

        await new Promise((r) =>
            responseToReadable(req)
                .pipe(createWriteStream(`files/${file}`))
                .once("finish", r),
        );

        return new Response("", { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response("", { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
    const fail = await _pre(cookies);
    if (fail) return fail;

    const file = url.searchParams.get("file")!;

    if (file.includes("/")) return new Response("", { status: 403 });

    try {
        await unlink(`files/${file}`);
        return new Response("", { status: 200 });
    } catch {
        return new Response("", { status: 500 });
    }
};
