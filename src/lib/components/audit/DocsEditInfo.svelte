<script lang="ts">
    import type { AuditLogEntry } from "$lib/types";
    import A from "../A.svelte";
    import Changelog from "../Changelog.svelte";

    export let entry: AuditLogEntry;
    export let hideBody: boolean = false;

    const { allowAdd: add, allowRemove: remove } = entry.data.changes;
</script>

<ul class="space">
    <Changelog
        changes={entry.data.changes}
        hide={["allowAdd", "allowRemove", "body", "embedBody"]}
        names={{
            allowCouncil: "Allow TCN Council Members",
            allowLoggedIn: "Allow all users who are logged in",
            allowEveryone: "Make this document fully public",
            anon: "Anonymous",
            official: "Official",
            embedTitle: "Embed Title",
            embedImage: "Embed Image",
            embedThumbnail: "Embed Thumbnail",
        }}
        code={["allowCouncil", "allowLoggedIn", "allowEveryone", "anon", "official", "embedThumbnail", "deleted"]}
    />
    {#if entry.data.changes.embedBody}
        {@const [before, after] = entry.data.changes.embedBody}
        <li>
            <span class="col no-center">
                <b>Embed Body:</b>
                <span class="arrow-diff">
                    <pre><code>{before}</code></pre>
                    <span class="row">&rightarrow;</span>
                    <pre><code>{after}</code></pre>
                </span>
            </span>
        </li>
    {/if}
    {#if add || remove}
        <li>
            <span class="col no-center">
                <b>Allowlist Changes:</b>
                <pre><code class="language-diff"
                        >{#if add}+ {add[1].join("\n+ ")}{#if remove}{"\n"}{/if}{/if}{#if remove}- {remove[1].join("\n- ")}{/if}</code
                    ></pre>
            </span>
        </li>
    {/if}
    {#if !hideBody && entry.data.changes.body}
        <li><b>Body:</b> Document body was changed. View the edit history <A to="/docs/revisions/{entry.uuid}" external>here</A>.</li>
    {/if}
</ul>

<style lang="scss">
    .arrow-diff {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr auto 1fr;
        width: 100%;
    }
</style>
