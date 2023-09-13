import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse/lib/index.js";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

declare const HTMLRewriter: any;

const rewriter = new HTMLRewriter().on("*", {
    async element(element: any) {
        console.log(element.tagName);
    },
});

export async function mdToHtml(content: string): Promise<string> {
    const file = await unified()
        .use(remarkParse as any)
        .use(remarkRehype as any)
        .use(rehypeStringify)
        .process(content);

    return await rewriter.transform(new Response(file?.value ?? "")).text();
}
