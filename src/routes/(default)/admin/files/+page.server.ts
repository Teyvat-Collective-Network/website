import type { ServerLoad } from "@sveltejs/kit";
import { readdir } from "node:fs/promises";

export const load: ServerLoad = async () => {
    return { files: await readdir("files") };
};
