<script lang="ts" context="module">
    const cycle = { before: "after", after: "diff", diff: "before" } as const;
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Show from "$lib/components/Show.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import DocsEditInfo from "$lib/components/audit/DocsEditInfo.svelte";
    import { token } from "$lib/stores";
    import type { AuditLogEntry } from "$lib/types";
    import { highlight } from "$lib/utils";
    import DiffMatchPatch from "diff-match-patch";
    import { onMount } from "svelte";

    const dmp = new DiffMatchPatch();

    let entry: AuditLogEntry;
    let parsed: [string, string] = ["", ""];
    let done = false;

    onMount(async () => {
        entry = await api($token, `GET /audit-logs/${$page.params.id}?action=docs/edit`).catch(alert);

        if (entry?.data.changes.body)
            for (const x of [0, 1]) parsed[x] = await (await fetch("/api/render", { method: "POST", body: entry.data.changes.body[x] })).text();

        done = true;
        setTimeout(() => highlight());
    });

    let details = false;
    let mode: keyof typeof cycle = "before";
</script>

<Loading {done}>
    {#if !entry}
        <Callout style="red">
            <p>Failed to fetch document revision.</p>
        </Callout>
    {:else}
        <h1 class="short">Document Revision</h1>
        <p>This is a revision of document <code>{entry.data.id}</code> (<UserMention id={entry.data.author} />) at <Timestamp ms timestamp={entry.time} />.</p>
        <p><span class="row gap-1"><Expand bind:open={details} /> <b>Metadata</b></span></p>
        <Show when={details}>
            <DocsEditInfo {entry} hideBody />
        </Show>
        <p>
            <b class="blue-text">Document is below this line.</b>
            <A on:click={() => (mode = cycle[mode])}>View {cycle[mode]}.</A>
        </p>
        <hr />
        <Show when={mode === "before"}>
            {@html parsed[0]}
        </Show>
        <Show when={mode === "after"}>
            {@html parsed[1]}
        </Show>
        <Show when={mode === "diff"}>
            <div class="mono round" style="background-color: rgb(40, 41, 45); padding: 0.4em 0.8em; font-size: 90%; overflow-x: scroll">
                {#each ((x) => (dmp.diff_cleanupSemantic(x), x))(dmp.diff_main(entry.data.changes.body[0], entry.data.changes.body[1])) as [type, block]}
                    {@const lines = block.split("\n")}
                    <span class={["", "hljs-addition", "hljs-deletion"].at(type)}
                        >{lines[0]}{#each lines.slice(1) as line}<br />{line}{/each}</span
                    >
                {/each}
            </div>
        </Show>
    {/if}
</Loading>
