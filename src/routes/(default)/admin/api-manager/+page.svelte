<script lang="ts">
    import api from "$lib/api";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { token, user } from "$lib/stores";
    import type { User } from "$lib/types";
    import { onMount } from "svelte";

    const tags = new Map<string, string | null>();

    const blocks: { stats: { guildCount: number; userCount: number; uptime: number }; user: User } = {} as any;
    const routes = { stats: "GET /stats" };

    async function reload(block: keyof typeof blocks & keyof typeof routes) {
        (blocks[block] as any) = undefined;
        blocks[block] = await api($token, routes[block]);
    }

    async function reloadAll() {
        for (const block of Object.keys(routes) as any[]) await reload(block);
    }

    onMount(() => {
        reloadAll();
        api($token, `GET /users/${$user!.id}`).then((data) => (blocks.user = data));
    });

    async function loadUser() {
        let first = true;

        while (true) {
            const id = prompt(`Enter a ${first ? "" : "valid "}user ID${first ? "" : " (17-20 digits)"}.`);
            first = false;

            if (!id) return;
            if (!id.match(/^\d{17,20}$/)) continue;

            (blocks.user as any) = undefined;
            blocks.user = await api($token, `GET /users/${id}`);
            return;
        }
    }
</script>

<div class="container">
    <h1>API Manager</h1>
    <h2>Stats <button on:click={() => reload("stats")}><Icon icon="refresh" /></button></h2>
    <Loading done={blocks.stats}>
        <ul>
            <li><b>Guilds:</b> <code>{blocks.stats.guildCount}</code></li>
            <li><b>Users:</b> <code>{blocks.stats.userCount}</code></li>
            <li><b>Uptime:</b> <code>{blocks.stats.uptime}</code> (since {new Date(Date.now() - blocks.stats.uptime).toLocaleString()})</li>
        </ul>
    </Loading>
    <h2>User <button on:click={loadUser}><Icon icon="file_download" /></button></h2>
    <Loading done={blocks.user}>
        {#if blocks.user.id === $user?.id}
            <Callout><p>This is your own account.</p></Callout>
        {/if}
        <pre>{JSON.stringify(blocks.user, undefined, 4)}</pre>
    </Loading>
</div>

<style lang="scss">
    h2 {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
</style>
