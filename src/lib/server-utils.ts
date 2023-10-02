import { HTMLRewriter } from "html-rewriter-wasm";
import { Readable } from "node:stream";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse/lib/index.js";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const channelIcons: Record<string, string> = {
    t: "tag",
    a: "campaign",
    v: "volume_up",
    f: "forum",
    s: "podcasts",
    c: "folder_open",
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function mdToHtml(content: string, reader?: string): Promise<string> {
    let output = "";

    const rewriter = new HTMLRewriter((chunk) => (output += decoder.decode(chunk))).on("*", {
        async element(element) {
            const classes = element.getAttribute("class")?.split(" ") ?? [];
            classes.push("md");
            element.setAttribute("class", classes.join(" "));
        },

        async text(text) {
            text.replace(
                text.text
                    .replace(
                        /\[@([1-9][0-9]{16,19})\]/g,
                        (_, id) =>
                            `<span class="mention with-icon" data-id="${id}"><span class="material-symbols-outlined">alternate_email</span> <user-id id="${id}" /></span>`,
                    )
                    .replace(
                        /\[([1-9][0-9]{16,19})?\$([^\]]+)\]/g,
                        (_, id, name) =>
                            `<span class="mention with-icon" data-id="${
                                id || ""
                            }"><span class="material-symbols-outlined">alternate_email</span> ${name}</span>`,
                    )
                    .replace(
                        /\[([tavfsc]?)#([^\]]+)\]/g,
                        (_, type, name) =>
                            `<span class="mention with-icon"><span class="material-symbols-outlined">${channelIcons[type || "t"]}</span> ${name}</span>`,
                    )
                    .replace(
                        /\[:(\d+)\]/g,
                        (_, timestamp) =>
                            `<span class="mention with-icon" data-id="${timestamp}"><span class="material-symbols-outlined">schedule</span> <time-stamp timestamp="${timestamp}" /></span>`,
                    )
                    .replace(
                        /\[:(\d+\-\d+\-\d+)\]/g,
                        (_, display) => `<span class="mention with-icon"><span class="material-symbols-outlined">schedule</span> ${display}</span>`,
                    )
                    .replace(
                        /\[reader\]/g,
                        `<span class="mention with-icon"><span class="material-symbols-outlined">${reader ? "alternate_email" : "account_circle"}</span> ${
                            reader ? `<user-id id=${reader} />` : "anonymous reader"
                        }</span>`,
                    )
                    .replace(/\[table\]/g, `<div class="md table-box">[table]`)
                    .replace(/\[\/table\]/g, `[/table]</div>`)
                    .replace(/\[(\/?(u|sup|sub|table|tr|th|td))\]/g, (_, tag) => `<${tag}${tag.startsWith("/") ? "" : ` class="md"`}>`)
                    .replace(/\[(th|td) ([lcr]|left|center|right)\]/g, (_, tag, align) => `<${tag} class="md align-${align.charAt(0)}">`)
                    .replace(/~~(.+?)~~/g, (_, content) => `<s>${content}</s>`),
                { html: true },
            );
        },
    });

    const file = await unified()
        .use(remarkParse as any)
        .use(remarkRehype as any)
        .use(rehypeStringify)
        .process(content);

    try {
        await rewriter.write(encoder.encode(file?.value.toString() ?? ""));
        await rewriter.end();

        return output;
    } finally {
        rewriter.free();
    }
}

export function responseToReadable(response: Response) {
    const reader = response.body!.getReader();
    const rs = new Readable();

    rs._read = async () => {
        const result = await reader.read();
        if (!result.done) rs.push(Buffer.from(result.value));
        else {
            rs.push(null);
            null;
        }
    };

    return rs;
}
