<script lang="ts" context="module">
    const statuses = {
        none: "none",
        "locked-out": "temporarily suspended",
        banned: "permanently banned",
        "locked-sender": "locked in as sender",
        "awaiting-approval": "awaiting approval to enter pool",
        "pool-free": "in pool, waiting for sender",
        "pool-locked": "locked in as receiver",
        limbo: "locked against user awaiting approval",
        done: "completed",
    };
</script>

<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token, user } from "$lib/stores";
    import type { SecretSantaUser } from "$lib/types";
    import { onMount } from "svelte";

    let loading = true;
    let entries: SecretSantaUser[];
    let users: string[];

    async function load() {
        loading = true;

        if ($user!.observer) users = await api($token, `GET /secret-santa/admin/admins`).catch(alert);
        entries = await api($token, `GET /secret-santa/all`).catch(alert);

        loading = false;
    }

    onMount(load);

    async function op(confirmation: string, key: string, id: string) {
        if (!confirm(confirmation)) return;
        await api($token, `POST /secret-santa/admin/${key}/${id}`).catch(alert);
        await load();
    }

    async function addAdmin() {
        const id = prompt("Enter a user ID.");
        if (!id) return;

        await api($token, `PUT /secret-santa/admin/admins/${id}`).catch(alert);
        await load();
    }

    async function rmAdmin(id: string) {
        if (!confirm("Remove admin?")) return;

        await api($token, `DELETE /secret-santa/admin/admins/${id}`).catch(alert);
        await load();
    }
</script>

<h2>Secret Santa Admin Panel</h2>
<p><button class="row" on:click={load}><Icon icon="refresh" /> Reload</button></p>
<Loading done={!loading}>
    {#if $user?.observer}
        <h3>Admins</h3>
        <ul class="space">
            <li><b>All Observers</b></li>
            {#each users as user}
                <li>
                    <span class="row"><UserMention id={user} /> &mdash; <A class="row red-text" on:click={() => rmAdmin(user)}><Icon icon="delete" /></A></span>
                </li>
            {/each}
        </ul>
        <br />
        <p><button on:click={addAdmin}><Icon icon="add" /></button></p>
    {/if}
    <h3><b>Pool size:</b> {entries.filter((x) => x.status === "pool-free").length}</h3>
    {#each entries.sort((x, y) => (x.status === "awaiting-approval" ? 0 : 1) - (y.status === "awaiting-approval" ? 0 : 1)) as entry}
        <div class="panel" style={entry.status === "awaiting-approval" ? "outline: 2px solid rgb(var(--text-accent))" : ""}>
            <h4 class="short"><UserId id={entry.user} /> &mdash; <code>{entry.user}</code></h4>
            <p><b>Status:</b> <code>{statuses[entry.status ?? "none"]}</code></p>
            {#if entry.partner}
                <p><b>Partner:</b> <UserMention id={entry.partner} /></p>
            {/if}
            <p><b>Info</b></p>
            {#if entry.info === undefined}
                <p class="text-2">(not completed)</p>
            {:else}
                <pre><code>{entry.info}</code></pre>
            {/if}
            <p><b>Proof</b></p>
            {#if entry.proof === undefined}
                <p class="text-2">(not completed)</p>
            {:else}
                <pre><code>{entry.proof}</code></pre>
            {/if}
            {#if entry.time}
                <p>
                    <b>Time:</b>
                    <Mention type="time"><Timestamp ms timestamp={entry.time} /></Mention>
                </p>
            {/if}
            <div class="row gap-1">
                {#if entry.status === "none"}
                    <button on:click={() => op("Adding user into pool as tail-end participant.", "add-to-pool", entry.user)}>add to pool</button>
                {/if}
                {#if entry.status === "locked-out" || entry.status === "locked-sender"}
                    <button on:click={() => op("Unbinding user from partner entirely and restoring status to none.", "unbind", entry.user)}>
                        unlock &amp; unbind
                    </button>
                {/if}
                {#if entry.status === "awaiting-approval"}
                    <button on:click={() => op("Approving user and moving them to pool.", "approve", entry.user)}>approve</button>
                    <button on:click={() => op("Denying user and permanently banning them.", "deny", entry.user)}>deny &amp; ban</button>
                {/if}
                {#if entry.status === "pool-free"}
                    <button on:click={() => op("Marking user as complete; only use this if they've received a gift.", "complete", entry.user)}>
                        mark as complete
                    </button>
                    <button on:click={() => op("Retroactively rejecting proof and banning the user.", "retroreject", entry.user)}>
                        retroactively reject proof
                    </button>
                {/if}
                {#if entry.status === "done"}
                    <button on:click={() => op("Returning user to pool of recipients.", "return", entry.user)}>return to pool</button>
                {/if}
                {#if entry.status === "banned"}
                    <button on:click={() => op("Resetting user's status to none.", "unban", entry.user)}>unban</button>
                {/if}
            </div>
        </div>
    {/each}
</Loading>
