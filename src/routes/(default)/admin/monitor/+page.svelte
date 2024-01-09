<script lang="ts" context="module">
    const names = { api: "All API Calls", rolesync: "Rolesync" } as const;
    const groups = Object.keys(names) as (keyof typeof names)[];
</script>

<script lang="ts">
    import { PUBLIC_WEBSOCKET } from "$env/static/public";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import GuildMention from "$lib/components/GuildMention.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token } from "$lib/stores";
    import type { Guild } from "$lib/types";
    import { onMount } from "svelte";

    let socket: WebSocket;

    let done = false,
        closed = false;

    let text = "Connecting to monitor...";

    const categories: Record<string, any[][]> = {};
    const subscribed: Record<string, boolean> = {};
    let guildNames: Record<string, string> = {};

    onMount(async () => {
        socket = new WebSocket(PUBLIC_WEBSOCKET);

        socket.onopen = () => {
            text = "Connected; authenticating...";
            socket.send(`TOKEN ${$token}`);
        };

        socket.onmessage = (e) => {
            const entry: any[] = JSON.parse(e.data);

            if (entry[0] === "OK") {
                setSubscribed("data", true);
                setSubscribed("rolesync", true);
                setSubscribed("api", true);
                done = true;
            } else if (entry[0] === "error") alert(entry[1]);
            else categories[entry[0]] = [[Date.now(), ...entry.slice(1)], ...(categories[entry[0]] ?? [])];
        };

        socket.onclose = () => {
            closed = true;
        };

        const guilds: Guild[] = await api($token, `GET /guilds`).catch(alert);
        for (const guild of guilds ?? []) guildNames[guild.id] = guild.name;
    });

    function setSubscribed(topic: string, on: boolean) {
        socket.send(`${on ? "" : "UN"}SUBSCRIBE ${topic}`);
        subscribed[topic] = on;
    }

    let viewing: keyof typeof names = groups[0];
    viewing = "rolesync";

    let max = 100,
        tempMax = 100;

    $: max && Object.entries(categories).forEach(([key, list]) => (categories[key] = list.slice(0, max)));
</script>

<h1>Monitor</h1>
<p class="row gap-1">
    <b>Maximum entries to keep:</b>
    {max}
    <button on:click={() => (max = tempMax)}><Icon icon="keyboard_double_arrow_left" /></button>
    <span>
        <input type="number" bind:value={tempMax} />
    </span>
</p>
<p class="text-2">Keeping too many entries may eventually cause your browser to slow down. Set to <code>0</code> to keep all entries.</p>
{#if closed}
    <Callout style="red">
        <p>The websocket connection has been closed. Try reloading.</p>
    </Callout>
{:else}
    <Loading {done} {text}>
        <p class="span row gap-1">
            {#each groups as topic}
                <p class="text-2"><button class="tp text-accent" on:click={() => (viewing = topic)} disabled={viewing === topic}>{names[topic]}</button></p>
            {/each}
        </p>
        <h3 class="short">{names[viewing]}</h3>
        {#if subscribed[viewing]}
            <p class="text-2">
                <A on:click={() => setSubscribed(viewing, false)}>Unsubscribe</A> to stop receiving events from this category and save some bandwidth.
            </p>
        {:else}
            <p class="text-2"><A on:click={() => setSubscribed(viewing, true)}>Subscribe</A> to receive events from this category.</p>
        {/if}
        <div class="w-100 hscroll">
            <table class="w-100">
                <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Summary</th>
                    <th>Details</th>
                </tr>
                {#each categories[viewing] ?? [] as [timestamp, type, ...entry]}
                    <tr>
                        <td><Mention type="time" id={timestamp}><Timestamp ms {timestamp} /></Mention></td>
                        {#if type === "request"}
                            {@const [method, path, body, id, internal, token] = entry}
                            <td>Request</td>
                            <td>
                                {#if id}<UserMention {id} />{:else}<Mention type="anon">Anonymous</Mention>{/if}: <code>{method} {path}</code>
                            </td>
                            <td>
                                <div class="row gap-1">
                                    <Modal button>
                                        <span slot="button">show details</span>
                                        <h3 class="short">API Call Details</h3>
                                        <p>
                                            <Mention type="time" id={timestamp}><Timestamp ms {timestamp} /></Mention> &mdash;
                                            {#if id}<UserMention {id} />{:else}<Mention type="anon">Anonymous</Mention>{/if} &mdash;
                                            <code>{method} {path}</code>
                                        </p>
                                        {#if token}
                                            <b>Token (public component):</b>
                                            <pre class="hscroll"><code>{token.slice(0, 16)}...{token.slice(-16)}</code></pre>
                                        {/if}
                                        <b>Request Body:</b>
                                        <pre><code>{JSON.stringify(body, undefined, 4)}</code></pre>
                                    </Modal>
                                    {#if !internal}<span class="text-2">[internal]</span>{/if}
                                </div>
                            </td>
                        {:else if type === "role-to-staff/promote" || type === "role-to-staff/demote"}
                            {@const [id, guild] = entry}
                            <td>
                                <div class="row gap-1">
                                    Role <Icon icon="trending_flat" /> Staff {type === "role-to-staff/promote" ? "Promoted" : "Demoted"}
                                </div>
                            </td>
                            <td><UserMention {id} /> in <GuildMention id={guild} {guildNames} /></td>
                        {:else if type === "staff-to-role/add" || type === "staff-to-role/remove"}
                            {@const [id, guild, roles] = entry}
                            <td>
                                <div class="row gap-1">
                                    Staff {type === "staff-to-role/add" ? "Promoted" : "Demoted"}
                                    <Icon icon="trending_flat" /> Roles Synced
                                </div>
                            </td>
                            <td><UserMention {id} /> in <GuildMention id={guild} {guildNames} /></td>
                            <td><code>{roles.join(" ")}</code></td>
                        {:else if type === "role-to-api" || type === "api-to-role"}
                            {@const [id, guild, add, remove] = entry}
                            <td>
                                <div class="row gap-1">
                                    {type === "role-to-api" ? "Role" : "API"}
                                    <Icon icon="trending_flat" />
                                    {type === "role-to-api" ? "API" : "Role"}
                                </div>
                            </td>
                            <td><UserMention {id} /> in <GuildMention id={guild} {guildNames} /></td>
                            <td>
                                {#if add.length > 0}Add: <code>{add.join(" ")}</code>{/if}
                                {#if remove.length > 0}Remove: <code>{remove.join(" ")}</code>{/if}
                            </td>
                        {:else}
                            <td>
                                <pre><code>{JSON.stringify(entry, undefined, 4)}</code></pre>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </table>
        </div>
    </Loading>
{/if}

<style lang="scss">
    * {
        white-space: nowrap;
    }

    .row {
        flex-wrap: unset !important;
    }
</style>
