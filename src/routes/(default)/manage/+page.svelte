<script lang="ts">
    import { PUBLIC_HQ, PUBLIC_HUB } from "$env/static/public";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { token, user } from "$lib/stores";
    import type { Guild } from "$lib/types";
    import { onMount } from "svelte";

    let guilds: Guild[];

    onMount(async () => {
        guilds = await api($token, `GET /guilds`).catch(alert);
        if (!$user!.observer) guilds = guilds.filter(({ owner }) => owner === $user!.id);
    });
</script>

<div class="container">
    <h1>Manage A Server</h1>
    <Loading done={guilds}>
        {#if guilds.length === 0}
            <p class="text-2">You do not have permission to manage any guilds.</p>
        {:else}
            <ul>
                {#if $user?.observer}
                    <li><A to="/manage/{PUBLIC_HQ}"><b>TCN HQ</b></A></li>
                    <li><A to="/manage/{PUBLIC_HUB}"><b>TCN Hub</b></A></li>
                {/if}
                {#each guilds as { id, name, owner, advisor }}
                    {#if $user?.observer || owner === $user?.id || advisor === $user?.id}
                        <li><A to="/manage/{id}">{name}</A></li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </Loading>
</div>
