<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import Badge from "$lib/components/Badge.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import GuildMention from "$lib/components/GuildMention.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import RoleBadges from "$lib/components/RoleBadges.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token } from "$lib/stores";
    import type { Guild, User } from "$lib/types";
    import { onMount } from "svelte";

    let user: User;
    let guildNames: Record<string, string> = {};
    let done = false;

    onMount(async () => {
        user = await api($token, `GET /users/${$page.params.id}`).catch(() => {});

        try {
            const guilds: Guild[] = await api($token, `GET /guilds`);
            for (const guild of guilds) guildNames[guild.id] = guild.name;
        } catch {}

        done = true;
    });
</script>

<div class="container">
    <Loading {done}>
        {#if user}
            <h3><UserMention id={user.id} /></h3>
            <div class="row gap-1">
                {#if user.observer}<Badge icon="local_police">TCN Observer</Badge>{/if}
                <RoleBadges context={user} />
            </div>
            {#if user.observer}
                <p><b class="text-2">Observer since <Mention type="time"><Timestamp ms timestamp={user.observerSince} /></Mention></b></p>
            {:else}
                <br />
            {/if}
            {#each Object.entries(user.guilds) as [id, guild]}
                <div class="panel bg-2">
                    <h4 class="short"><GuildMention {id} {guildNames} openInTab /></h4>
                    <p class="row gap-1">
                        <RoleBadges context={guild} />
                    </p>
                </div>
            {/each}
        {:else}
            <Callout style="red">
                <p>No user was found in the API with ID <code>{$page.params.id}</code>.</p>
            </Callout>
        {/if}
    </Loading>
</div>
