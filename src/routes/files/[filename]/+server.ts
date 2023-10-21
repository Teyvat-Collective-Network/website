import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "fs/promises";
import mime from "mime";

export const GET: RequestHandler = async ({ params: { filename } }) => {
    if (filename!.includes("..")) return new Response("", { status: 403 });

    return new Response(await readFile(`files/${filename}`), { headers: { "Content-Type": mime.getType(filename!)! } });
};
