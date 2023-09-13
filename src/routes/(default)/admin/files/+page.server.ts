import type { ServerLoad } from "@sveltejs/kit";
import { mkdir, readdir } from "node:fs/promises";

export const load: ServerLoad = async () => {
    try {
        await mkdir("files");
    } catch {}

    return { files: await readdir("files") };
};
