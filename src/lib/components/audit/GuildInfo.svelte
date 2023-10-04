<script lang="ts">
    import type { AuditLogEntry } from "$lib/types";
    import A from "../A.svelte";
    import UserMention from "../UserMention.svelte";

    export let entry: AuditLogEntry;
</script>

<ul class="space">
    <li><b>Mascot:</b> <code>{entry.data.mascot}</code></li>
    <li><b>Invite:</b> <A to="https://discord.gg/{entry.data.invite}"><code>{entry.data.invite}</code></A></li>
    <li><b>Owner:</b> <UserMention id={entry.data.owner} /></li>
    <li>
        <b>Advisor:</b>
        {#if entry.data.advisor}<UserMention id={entry.data.advisor} />{:else}<span class="text-2">(none)</span>{/if}
    </li>
    <li><b>Voter:</b> {entry.data.delegated ? "Council Advisor" : "Server Owner"}</li>
</ul>
