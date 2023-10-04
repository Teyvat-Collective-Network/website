<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Show from "$lib/components/Show.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token } from "$lib/stores";
    import type { AuditLogEntry } from "$lib/types";
    import { highlight } from "$lib/utils";
    import { onMount } from "svelte";

    let entry: AuditLogEntry;
    let parsed: string;
    let done = false;

    onMount(async () => {
        entry = await api($token, `GET /audit-logs/${$page.params.id}?action=docs/create`).catch(alert);
        if (entry) parsed = await (await fetch("/api/render", { method: "POST", body: entry.data.body })).text();

        done = true;
        setTimeout(() => highlight());
    });

    let details = false;
    let source = false;
</script>

<Loading {done}>
    {#if !entry}
        <Callout style="red">
            <p>Failed to fetch document snapshot.</p>
        </Callout>
    {:else}
        <h1 class="short">Document Snapshot</h1>
        <p>
            This is a snapshot of document <code>{entry.data.id}</code> (<UserMention id={entry.data.author} />) when it was created at <Timestamp
                ms
                timestamp={entry.time}
            />.
        </p>
        <p><span class="row gap-1"><Expand bind:open={details} /> <b>Metadata</b></span></p>
        <Show when={details}>
            <ul>
                {#if entry.data.official}<li><b>Official</b></li>{/if}
                <li><b>Anonymous:</b> <code>{entry.data.anon}</code></li>
                <li><b>Allow TCN Council Members:</b> <code>{entry.data.allowCouncil}</code></li>
                <li><b>Allow all users who are logged in:</b> <code>{entry.data.allowLoggedIn}</code></li>
                <li><b>Make this document fully public:</b> <code>{entry.data.allowEveryone}</code></li>
                <li>
                    <b>Allowlist:</b>
                    {#if entry.data.allowlist.length > 0}<code>{entry.data.allowlist.join(" ")}</code>{:else}<span class="text-2">(none)</span>{/if}
                </li>
                <li>
                    <b>Embed Data:</b>
                    <ul>
                        <li><b>Title:</b> {entry.data.embedTitle}</li>
                        <li>
                            <span class="col no-center">
                                <b>Body:</b>
                                <pre><code class="language-md">{entry.data.embedBody}</code></pre>
                            </span>
                        </li>
                        <li><b>Color:</b> <code>#{entry.data.embedColor.toString(16).padStart(6, "0")}</code></li>
                        <li>
                            <b>Image:</b>
                            {#if entry.data.embedImage}<A to={entry.data.embedImage}>{entry.data.embedImage}</A>{:else}<span class="text-2">(none)</span>{/if}
                        </li>
                        <li><b>Thumbnail:</b> <code>{entry.data.embedThumbnail}</code></li>
                    </ul>
                </li>
            </ul>
        </Show>
        <p>
            <b class="blue-text">Document is below this line.</b>
            <A on:click={() => (source = !source)}>{source ? "View Rendered Output" : "View Source"}</A>
        </p>
        <hr />
        <Show when={source}>
            <pre><code class="language-md">{entry.data.body}</code></pre>
        </Show>
        <Show when={!source}>
            {@html parsed}
        </Show>
    {/if}
</Loading>
