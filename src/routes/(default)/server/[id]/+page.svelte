<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Image from "$lib/components/Image.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token } from "$lib/stores";
    import type { Guild } from "$lib/types";
    import { onMount } from "svelte";

    let guild: Guild;
    let done = false;

    onMount(async () => {
        guild = await api($token, `GET /guilds/${$page.params.id}`).catch(() => {});
        done = true;
    });
</script>

<div class="container">
    <Loading {done}>
        {#if guild}
            {@const staff = Object.entries(guild.users)
                .filter(([id, user]) => user.staff && id !== guild.owner && id !== guild.advisor)
                .map(([id]) => id)}
            <div class="row gap-2">
                <Image src="/files/{guild.mascot}.png" alt="{guild.name}'s Mascot Icon" transparent height={80} />
                <h1>{guild.name}</h1>
                <span><LinkButton to="https://discord.gg/{guild.invite}">Join!</LinkButton></span>
            </div>
            <ul class="space">
                <li><b>Owner:</b> <A to="/user/{guild.owner}"><Mention><UserId id={guild.owner} /></Mention></A></li>
                {#if guild.advisor}
                    <li><b>Advisor:</b> <A to="/user/{guild.advisor}"><Mention><UserId id={guild.advisor} /></Mention></A></li>
                {/if}
                <li>
                    <b>Staff:</b>
                    {#if staff.length === 0}
                        <span class="text-2">(none)</span>
                    {:else}
                        {#each staff as id}
                            <A to="/user/{id}"><Mention><UserId {id} /></Mention></A>
                        {/each}
                    {/if}
                </li>
            </ul>
        {:else}
            <Callout style="red">
                <p>No guild was found with ID <code>{$page.params.id}</code>.</p>
            </Callout>
        {/if}
    </Loading>
</div>
