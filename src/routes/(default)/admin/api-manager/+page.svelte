<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { user as self, token } from "$lib/stores";
    import type { Guild } from "$lib/types";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    let user: string = $self!.id;
    let tag: string | null = null;
    let guilds: Guild[];

    onMount(async () => {
        guilds = await api($token, `GET /guilds`);
    });

    async function invalidate() {
        if (!user) return;

        if (
            !confirm(
                `Are you sure you want to invalidate ${tag ?? "this user"}'s tokens? This will log them out everywhere and make all of their API keys invalid.`,
            )
        )
            return;

        withAudit(async (reason) => await api($token, `POST /auth/invalidate/${user}`, undefined, reason).catch(alert), true);
    }
</script>

<h3>Users / Invalidate Token</h3>
<input type="text" placeholder="Enter a user ID." bind:value={user} />
<br /><br />
{#if user?.match(/^[1-9][0-9]{16,19}$/)}
    <p class="row gap-1">
        <A to="/admin/api-manager/users/{user}">Manage <Mention><UserId id={user} bind:tag /></Mention></A>
        {#if user !== $self?.id}
            &mdash;
            <button on:click={invalidate}>Invalidate All Tokens</button>
        {/if}
    </p>
    <br />
{/if}
<hr />
<h3>Guilds</h3>
<Loading done={guilds}>
    {#if guilds.length > 0}
        <ul>
            {#each guilds as guild}
                <li><A to="/admin/api-manager/guilds/{guild.id}">{guild.name}</A></li>
            {/each}
        </ul>
        <br />
    {/if}
    <A class="inline-row gap-1" to="/admin/api-manager/guilds/create"><Icon icon="add" /> Create Guild</A>
</Loading>
<br /><br />
<hr />
<h3>Others</h3>
<ul>
    <li><A to="/admin/api-manager/characters">Edit Character-Related Data</A></li>
</ul>
