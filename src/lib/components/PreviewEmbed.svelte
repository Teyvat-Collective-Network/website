<script lang="ts">
    import marked from "$lib/marked";
    import sanitize from "sanitize-html";

    export let data: any = {};

    function parse(content?: string) {
        return sanitize(marked.parse(content ?? ""), {
            allowedClasses: { span: ["u", "mention", "with-icon", "material-symbols-outlined"] },
            allowedAttributes: { a: sanitize.defaults.allowedAttributes.a.concat(["title"]) },
        });
    }

    function partition(fields: { inline: boolean }[]) {
        const rows: any[][] = [];

        for (const field of fields) {
            if (field.inline && rows.length > 0 && rows.at(-1)!.length < 3 && rows.at(-1)!.at(-1)!.inline) rows.at(-1)!.push(field);
            else rows.push([field]);
        }

        return rows;
    }
</script>

<div id="main" class="round" style="display: grid; gap: 0; grid-template-columns: 72px 1fr; padding: 1em 0">
    <div class="col">
        <img
            src={data.avatarURL || "https://teyvatcollective.network/favicon.png"}
            alt="Webhook Icon"
            style="width: 40px; height: 40px; border-radius: 50%; margin-top: 2px"
        />
    </div>
    <div>
        <div class="row gap-05">
            <span id="username" style="font-size: 16px; line-height: 22px; font-weight: 400; cursor: pointer">{data.username || "TCN Embeds"}</span>
            <span style="background-color: var(--bot-tag); font-size: 10px; line-height: 15px; margin-top: 0.75px; padding: 0 4.4px; border-radius: 2.5px">
                BOT
            </span>
        </div>
        <div class="mdblock" style="font-size: 16px; margin: 3px 0">
            {@html parse(data.content)}
        </div>
        <div class="col no-center" style="gap: 8px">
            {#each data.embeds ?? [] as embed}
                <div>
                    <div
                        style="background-color: var(--d-bg-embed); display: inline-grid; grid-template-columns: 1fr min-content; max-width: 400px; padding: 8px 16px 16px 12px; border-radius: 4px; border-left: 4px solid {typeof embed.color ===
                        'number'
                            ? `#${embed.color.toString(16).padStart(6, '0')}`
                            : 'var(--d-default-embed-color)'}"
                    >
                        <div style={embed.thumbnail ? "" : "grid-column: 1 / -1"}>
                            {#if embed.author?.name}
                                <div class="row" style="margin-top: 8px; font-size: 14px; line-height: 22px; font-weight: 500">
                                    {#if embed.author.icon_url}
                                        <img
                                            src={embed.author.icon_url}
                                            alt="Embed Author Icon"
                                            style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px"
                                        />
                                    {/if}
                                    {#if embed.author.url}
                                        <a href={embed.author.url} style="font-weight: 500" target="_blank" rel="noreferrer">{embed.author.name}</a>
                                    {:else}
                                        {embed.author.name}
                                    {/if}
                                </div>
                            {/if}
                            {#if embed.title}
                                <div class="mdblock" style="margin-top: 8px; font-size: 16px; line-height: 22px; font-weight: 500">
                                    {#if embed.url}
                                        <a href={embed.url} style="font-weight: 500" target="_blank" rel="noreferrer">{@html parse(embed.title)}</a>
                                    {:else}
                                        {@html parse(embed.title)}
                                    {/if}
                                </div>
                            {/if}
                            {#if embed.description}
                                <div class="mdblock" style="font-size: 14px; line-height: 18px; margin-top: 8px">{@html parse(embed.description)}</div>
                            {/if}
                            {#if embed.fields}
                                <div style="margin-top: 8px; display: grid; gap: 8px">
                                    {#each partition(embed.fields) as row}
                                        {#each row as field, index}
                                            <div
                                                style="font-size: 14px; line-height: 18px; grid-column: {(index * 12) / row.length + 1} / span {12 /
                                                    row.length}"
                                            >
                                                <div style="font-weight: 500; margin-bottom: 2px">{field.name}</div>
                                                <div>{field.value}</div>
                                            </div>
                                        {/each}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                        {#if embed.thumbnail}
                            <div style="margin: 8px 0 0 16px">
                                <img src={embed.thumbnail.url} alt="Embed Thumbnail" style="width: 80px; height: 80px; border-radius: 4px" />
                            </div>
                        {/if}
                        {#if embed.image}
                            <div style="margin-top: 16px; grid-column: 1 / -1; line-height: 0">
                                <img src={embed.image.url} alt="Embed Primary" style="max-width: 400px; max-height: 300px" />
                            </div>
                        {/if}
                        {#if embed.footer?.text}
                            <div class="row" style="margin-top: 8px; grid-column: 1 / -1; font-size: 12px; line-height: 16px">
                                {#if embed.footer.icon_url}
                                    <img
                                        src={embed.footer.icon_url}
                                        alt="Embed Footer Icon"
                                        style="width: 20px; height: 20px; border-radius: 50%; margin-right: 8px"
                                    />
                                {/if}
                                {embed.footer.text}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    :root {
        --bot-tag-hsl: 235 calc(var(--saturation-factor, 1) * 85.6%) 64.7%;
        --bot-tag: hsl(var(--bot-tag-hsl) / 1);
    }

    @font-face {
        font-family: "gg sans";
        font-weight: 300;
        src: url("/ggsans-normal.woff2");
    }

    @font-face {
        font-family: "gg sans";
        font-weight: 400;
        src: url("/ggsans-medium.woff2");
    }

    @font-face {
        font-family: "gg sans";
        font-weight: 500;
        src: url("/ggsans-semibold.woff2");
    }

    @font-face {
        font-family: "gg sans";
        font-weight: 600;
        src: url("/ggsans-bold.woff2");
    }

    * {
        font-family: "gg sans";
        font-weight: 300;
    }

    :global(.mdblock) {
        & p {
            margin: 0;
            padding: 0;
            line-height: 132%;

            &:not(:first-child) {
                padding-top: 12px;
            }
        }

        & b {
            font-weight: 600;
        }

        & a {
            color: rgb(0, 168, 252);
            text-decoration: none;
        }

        & span.u {
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        & span.material-symbols-outlined {
            font-size: 100%;
        }

        & span.mention.with-icon {
            margin: -2px 0 0 0;
            top: 2px;
        }
    }

    #main {
        background-color: var(--d-bg-main);

        &:hover {
            background-color: var(--d-bg-hover);
        }
    }

    #username:hover {
        text-decoration: underline;
        text-underline-offset: 2px;
    }
</style>
