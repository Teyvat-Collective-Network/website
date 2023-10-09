<script lang="ts">
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
                {#each guilds as { id, name, owner }}
                    {#if $user?.observer || owner === $user?.id}
                        <li><A to="/manage/{id}">{name}</A></li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </Loading>
</div>
