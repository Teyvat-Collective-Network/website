import { HTMLRewriter } from "html-rewriter-wasm";
import { Readable } from "node:stream";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse/lib/index.js";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function mdToHtml(content: string): Promise<string> {
    let output = "";

    const rewriter = new HTMLRewriter((chunk) => (output += decoder.decode(chunk))).on("*", {
        async element(element: any) {
            const classes = element.getAttribute("class")?.split(" ") ?? [];
            classes.push("md");

            element.setAttribute("class", classes.join(" "));
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
