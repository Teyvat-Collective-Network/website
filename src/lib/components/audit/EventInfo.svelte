<script lang="ts">
    import type { AuditLogEntry } from "$lib/types";
    import A from "../A.svelte";
    import Show from "../Show.svelte";
    import Timestamp from "../Timestamp.svelte";

    export let entry: AuditLogEntry;
    export let open: boolean;
</script>

<ul class="space">
    <li><b>Span:</b> <Timestamp ms timestamp={entry.data.start} /> &mdash; <Timestamp ms timestamp={entry.data.end} /></li>
    <li>
        <b>Invites:</b>
        {#if entry.data.invites.length > 0}<code>{entry.data.invites.join(" ")}</code>{:else}<span class="text-2">(none)</span>{/if}
    </li>
    <li>
        <span class="col no-center">
            <span>
                <b>Body:</b>
                <A on:click={() => (open = !open)}>{open ? "Hide" : "Show"}</A>.
            </span>
            <Show when={open}>
                <pre><code class="language-md">{entry.data.body}</code></pre>
            </Show>
        </span>
    </li>
</ul>
