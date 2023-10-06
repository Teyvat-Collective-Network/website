<script lang="ts" context="module">
    const actions: Record<string, { title: string; icon: string; default?: boolean }> = {
        apply: { title: "Application Submitted", icon: "send" },
        "attributes/create": { title: "Attribute created", icon: "add_box" },
        "attributes/delete": { title: "Attribute deleted", icon: "delete_forever" },
        "attributes/edit": { title: "Attribute edited", icon: "edit" },
        "auth/invalidate/other": { title: "User tokens invalidated by observer", icon: "dangerous" },
        "auth/invalidate/self": { title: "User invalidated own tokens", icon: "dangerous", default: false },
        "auth/key": { title: "API key created", icon: "key", default: false },
        "banshares/create": { title: "Banshare posted", icon: "upload" },
        "banshares/crosspost": { title: "Banshare crossposts created (internal)", icon: "arrow_forward", default: false },
        "banshares/delete": { title: "Banshare deleted", icon: "delete_forever" },
        "banshares/execute": { title: "Banshare executed (internal)", icon: "gavel", default: false },
        "banshares/logs/add": { title: "Banshare logging channel added", icon: "playlist_add" },
        "banshares/logs/remove": { title: "Banshare logging channel removed", icon: "playlist_remove" },
        "banshares/publish": { title: "Banshare published", icon: "podcasts" },
        "banshares/reject": { title: "Banshare rejected", icon: "clear" },
        "banshares/report": { title: "Banshare reported", icon: "flag" },
        "banshares/rescind": { title: "Banshare rescinded", icon: "remove_done" },
        "banshares/settings": { title: "Banshare settings edited", icon: "settings" },
        "banshares/severity": { title: "Banshare severity changed", icon: "unfold_more" },
        "characters/create": { title: "Character created", icon: "add_box" },
        "characters/delete": { title: "Character deleted", icon: "delete_forever" },
        "characters/edit": { title: "Character edited", icon: "edit" },
        "docs/create": { title: "Document created", icon: "contract" },
        "docs/delete": { title: "Document deleted by observer", icon: "contract_delete" },
        "docs/edit": { title: "Document edited", icon: "contract_edit" },
        "docs/official/add": { title: "Document official designation added", icon: "heart_check" },
        "docs/official/remove": { title: "Document official designation removed", icon: "heart_minus" },
        "events/create": { title: "Event created", icon: "calendar_add_on" },
        "events/delete/other": { title: "Event deleted by observer", icon: "event_busy" },
        "events/delete/self": { title: "Event deleted by self", icon: "event_busy" },
        "events/edit": { title: "Event edited", icon: "edit_calendar" },
        "guilds/create": { title: "Guild created", icon: "add_box" },
        "guilds/delete": { title: "Guild deleted", icon: "delete_forever" },
        "guilds/edit": { title: "Guild edited", icon: "edit" },
        "observation-records/edit": { title: "Observation record edited", icon: "edit" },
        "users/demote": { title: "User demoted from observer", icon: "remove_moderator" },
        "users/promote": { title: "User promoted to observer", icon: "add_moderator" },
        "users/roles/add": { title: "User role added", icon: "code" },
        "users/roles/remove": { title: "User role removed", icon: "code_off" },
        "users/staff/add": { title: "User added to staff team", icon: "person_add" },
        "users/staff/remove": { title: "User removed from staff team", icon: "person_remove" },
        "users/term/refresh": { title: "User term refreshed / re-elected", icon: "refresh" },
    };
</script>

<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Changelog from "$lib/components/Changelog.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import FixedButton from "$lib/components/FixedButton.svelte";
    import GuildMention from "$lib/components/GuildMention.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Invite from "$lib/components/Invite.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Show from "$lib/components/Show.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import DocsEditInfo from "$lib/components/audit/DocsEditInfo.svelte";
    import EventInfo from "$lib/components/audit/EventInfo.svelte";
    import GuildInfo from "$lib/components/audit/GuildInfo.svelte";
    import { alerts, token } from "$lib/stores";
    import type { AuditLogEntry, Guild } from "$lib/types";
    import { highlight } from "$lib/utils";
    import { onMount } from "svelte";

    let entries: AuditLogEntry[] = [];
    const limit = 50;
    let done = false;
    let loading = true;

    const guildNames: Record<string, string> = {};

    onMount(async () => {
        const incoming = await api($token, `GET /audit-logs?limit=${limit}`).catch(alert);

        const guilds: Guild[] = await api($token, `GET /guilds`).catch(alert);
        if (guilds) for (const guild of guilds) guildNames[guild.id] = guild.name;

        if (incoming) {
            entries = [...entries, ...incoming];
            loading = false;
        }

        setTimeout(highlight);
    });

    async function loadMore() {
        loading = true;
        const incoming = await api($token, `GET /audit-logs?before=${entries.at(-1)?.time ?? Date.now()}&limit=${limit}`).catch(alert);

        if (incoming) {
            if (incoming.length === 0) {
                done = true;
                alerts.nomore.update((x) => x + 1);
                setTimeout(() => alerts.nomore.update((x) => x - 1), 1500);
            } else entries = [...entries, ...incoming];

            loading = false;
        }

        setTimeout(highlight);
    }

    let solo: string | null = null;

    let show: Record<string, boolean> = Object.fromEntries(Object.entries(actions).map(([x, y]) => [x, y.default ?? true]));
    let showItem: Record<string, boolean> = {};

    let open = false;

    let executor: string | null = null;
    let id: string | null = null;
    let guild: string | null = null;

    const expanded: Record<number, boolean> = {};

    function attributeChanges(changes: Record<string, [any, any]>) {
        return Object.fromEntries(
            Object.entries(changes)
                .filter(([key]) => key.startsWith("attributes/"))
                .map(([key, value]) => [key.slice(11), value]),
        );
    }
</script>

<h1>Audit Logs</h1>
<button class="row" on:click={() => (open = true)}><Icon icon="tune" /> <b>Filters</b></button>
<br />
{#each entries as entry}
    {@const { data } = entry}
    <Show
        when={(!executor || entry.user === executor) &&
            (!id || data.id === id) &&
            (!guild || data.guild === guild) &&
            (solo ? entry.action === solo : show[entry.action])}
    >
        <div class="panel">
            <h6 class="short row gap-1">
                <Icon icon={actions[entry.action]?.icon ?? ""} />
                {actions[entry.action]?.title ?? entry.action} <span class="text-2">(<Timestamp ms timestamp={entry.time} />)</span>
            </h6>
            <p class="description">
                <span>
                    <UserMention id={entry.user} />
                    {#if entry.action === "apply"}
                        ({entry.data.role === "other" ? entry.data.roleother : entry.data.role}) applied for
                        <A to="https://discord.gg/{entry.data.code}" external><Mention type="guild">{entry.data.name}</Mention></A>.
                    {:else if entry.action === "attributes/create"}
                        created attribute <code>{entry.data.type}:{entry.data.id}</code>:
                        <ul class="space">
                            <li><b>Name:</b> {entry.data.name}</li>
                            <li><b>Emoji:</b> <code>{entry.data.emoji}</code></li>
                        </ul>
                    {:else if entry.action === "attributes/delete"}
                        deleted attribute <code>{entry.data.type}:{entry.data.id}</code>:
                        <ul class="space">
                            <li><b>Name:</b> {entry.data.name}</li>
                            <li><b>Emoji:</b> <code>{entry.data.emoji}</code></li>
                        </ul>
                    {:else if entry.action === "attributes/edit"}
                        edited attribute <code>{entry.data.type}:{entry.data.id}</code>:
                        <ul class="space">
                            <Changelog changes={entry.data.changes} code={["id", "emoji"]} />
                        </ul>
                    {:else if entry.action === "auth/invalidate/other"}
                        invalidated all tokens for <UserMention id={entry.data.id} />.
                    {:else if entry.action === "auth/invalidate/self"}
                        invalidated all of their own tokens.
                    {:else if entry.action === "auth/key"}
                        created a new API key that
                        {#if entry.data.expires}
                            expires at <Timestamp ms timestamp={entry.data.expires} /> (<code>{entry.data.expires - entry.data.created}</code> milliseconds)
                        {:else}
                            does not expire
                        {/if}
                        with scopes <code>[{entry.data.scopes.join(", ")}]</code>.
                    {:else if entry.action === "banshares/create"}
                        submitted a banshare (<code>{entry.data.message}</code>, <A to="/banshares/{entry.data.message}" external>view</A>) ({entry.data
                            .severity}, {entry.data.urgent ? "urgent" : "non-urgent"}) from
                        <GuildMention id={entry.data.server} {guildNames} />.
                    {:else if entry.action === "banshares/crosspost"}
                        crossposted <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>) to several channels.
                        This action is usually a result of publishing a banshare. Channel list:
                        <ul class="space">
                            {#each entry.data.crossposts as { guild, channel }}
                                <li>
                                    <GuildMention id={guild} {guildNames} /> &mdash;
                                    <A to="https://discord.com/channels/{guild}/{channel}" external>link to channel</A> (<code>{channel}</code>)
                                </li>
                            {/each}
                        </ul>
                    {:else if entry.action === "banshares/delete"}
                        deleted <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>). This action is usually a
                        result of acting on a banshare and triggered by the banshare dashboard update.
                    {:else if entry.action === "banshares/execute"}
                        executed <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>) in
                        <GuildMention id={entry.data.guild} {guildNames} />. {#if entry.data.auto}(Autoban action; this was triggered by publishing this
                            banshare.){/if}
                    {:else if entry.action === "banshares/logs/add"}
                        added <A to="https://discord.com/channels/{entry.data.guild}/{entry.data.channel}" external>a logging channel</A>
                        (<code>{entry.data.channel}</code>) to <GuildMention id={entry.data.guild} {guildNames} />.
                    {:else if entry.action === "banshares/logs/remove"}
                        removed <A to="https://discord.com/channels/{entry.data.guild}/{entry.data.channel}" external>a logging channel</A>
                        (<code>{entry.data.channel}</code>) from <GuildMention id={entry.data.guild} {guildNames} />.
                    {:else if entry.action === "banshares/publish"}
                        published <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>).
                    {:else if entry.action === "banshares/reject"}
                        rejected <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>).
                    {:else if entry.action === "banshares/report"}
                        reported <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>).
                    {:else if entry.action === "banshares/rescind"}
                        rescinded <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>).
                    {:else if entry.action === "banshares/settings"}
                        updated banshare settings in <GuildMention id={entry.data.guild} {guildNames} />:
                        <ul class="space">
                            <Changelog
                                changes={entry.data.changes}
                                names={{ blockdms: "Block DMs", nobutton: "No Button", daedalus: "Daedalus Integration" }}
                                code={["autoban", "blockdms", "nobutton", "daedalus"]}
                            />
                        </ul>
                    {:else if entry.action === "banshares/severity"}
                        modified the severity of <A to="/banshares/{entry.data.message}" external>a banshare</A> (<code>{entry.data.message}</code>) from
                        <code>{entry.data.changes.severity[0]}</code> &rightarrow; <code>{entry.data.changes.severity[1]}</code>.
                    {:else if entry.action === "characters/create"}
                        created character <code>{entry.data.id}</code>:
                        <ul class="space">
                            <li><b>Name:</b> {entry.data.name}</li>
                            <li>
                                <b>Short Name:</b>
                                {#if entry.data.short}{entry.data.short}{:else}<span class="text-2">(none)</span>{/if}
                            </li>
                            {#each Object.entries(entry.data.attributes) as [type, id]}
                                <li><b><code>{type}</code></b>: <code>{id}</code></li>
                            {/each}
                        </ul>
                    {:else if entry.action === "characters/delete"}
                        deleted character <code>{entry.data.id}</code>:
                        <ul class="space">
                            <li><b>Name:</b> {entry.data.name}</li>
                            <li>
                                <b>Short Name:</b>
                                {#if entry.data.short}{entry.data.short}{:else}<span class="text-2">(none)</span>{/if}
                            </li>
                            {#each Object.entries(entry.data.attributes) as [type, id]}
                                <li><b><code>{type}</code></b>: <code>{id}</code></li>
                            {/each}
                        </ul>
                    {:else if entry.action === "characters/edit"}
                        edited character <code>{entry.data.id}</code>:
                        <ul class="space">
                            <Changelog changes={entry.data.changes} show={["name", "short"]} />
                            <Changelog changes={attributeChanges(entry.data.changes)} codeAll />
                        </ul>
                    {:else if entry.action === "docs/create"}
                        created <A to="/docs/{entry.data.id}" external>{entry.data.title}</A> (<code>{entry.data.id}</code>).
                        <A to="/docs/snapshot/{entry.uuid}" external>View Snapshot</A>.
                        <ul class="space">
                            {#if entry.data.official}
                                <li><b>Official</b></li>
                            {/if}
                            <li>
                                <b>Visibility:</b>
                                {entry.data.allowEveryone
                                    ? "Public"
                                    : entry.data.allowLoggedIn
                                    ? "Logged In Users"
                                    : entry.data.allowCouncil
                                    ? "TCN Council"
                                    : "Private"}
                            </li>
                            <li><b>Anonymous:</b> <code>{entry.data.anon}</code></li>
                            {#if entry.data.allowlist.length > 0}
                                <li><b>Allowlist:</b> <code>{entry.data.allowlist.join(" ")}</code></li>
                            {/if}
                        </ul>
                    {:else if entry.action === "docs/delete"}
                        deleted <A to="/docs/{entry.data.id}" external>{entry.data.title}</A>
                        (<code>{entry.data.id}</code> &mdash; <UserMention id={entry.data.author} />).
                    {:else if entry.action === "docs/edit"}
                        edited <A to="/docs/{entry.data.id}" external>{entry.data.title}</A>
                        (<code>{entry.data.id}</code>).
                        <DocsEditInfo {entry} />
                    {:else if entry.action === "docs/official/add"}
                        marked <A to="/docs/{entry.data.id}">{entry.data.title}</A> (<code>{entry.data.id}</code> &mdash;
                        <UserMention id={entry.data.author} />) as official.
                    {:else if entry.action === "docs/official/remove"}
                        removed the official designation for <A to="/docs/{entry.data.id}">{entry.data.title}</A> (<code>{entry.data.id}</code> &mdash;
                        <UserMention id={entry.data.author} />).
                    {:else if entry.action === "events/create"}
                        created <b>{entry.data.title}</b> (#{entry.data.id}):
                        <EventInfo {entry} bind:open={showItem[`${entry.uuid}`]} />
                    {:else if entry.action === "events/delete/other"}
                        deleted <b>{entry.data.title}</b> (#{entry.data.id} &mdash; owned by <UserMention id={entry.data.owner} /> ):
                        <EventInfo {entry} bind:open={showItem[`${entry.uuid}`]} />
                    {:else if entry.action === "events/delete/self"}
                        deleted <b>{entry.data.title}</b> (#{entry.data.id} &mdash; self-deletion):
                        <EventInfo {entry} bind:open={showItem[`${entry.uuid}`]} />
                    {:else if entry.action === "events/edit"}
                        {@const { inviteAdd: add, inviteRemove: remove } = entry.data.changes}
                        edited <b>{entry.data.title}</b> (#{entry.data.id}):
                        <ul class="space">
                            <Changelog changes={entry.data.changes} hide={["body", "inviteAdd", "inviteRemove"]} />
                            {#if add || remove}
                                <li>
                                    <span class="col no-center">
                                        <b>Invite List Changes:</b>
                                        <pre><code class="language-diff"
                                                >{#if add}+ {add[1].join("\n+ ")}{#if remove}{"\n"}{/if}{/if}{#if remove}- {remove[1].join("\n- ")}{/if}</code
                                            ></pre>
                                    </span>
                                </li>
                            {/if}
                            {#if entry.data.changes.body}
                                <li><b>Body:</b> Event body changed. <A on:click={() => (showItem[`${entry.uuid}`] = true)}>Show Diff</A>.</li>
                                <Modal bind:open={showItem[`${entry.uuid}`]}>
                                    <div class="diff">
                                        <pre><code class="language-md">{entry.data.changes.body[0]}</code></pre>
                                        <pre><code class="language-md">{entry.data.changes.body[1]}</code></pre>
                                    </div>
                                </Modal>
                            {/if}
                        </ul>
                    {:else if entry.action === "guilds/create"}
                        created <GuildMention id={entry.data.id} name={entry.data.name} />:
                        <GuildInfo {entry} />
                    {:else if entry.action === "guilds/delete"}
                        deleted <GuildMention id={entry.data.id} name={entry.data.name} />:
                        <GuildInfo {entry} />
                    {:else if entry.action === "guilds/edit"}
                        edited <GuildMention id={entry.data.id} name={entry.data.name} />:
                        <ul class="space">
                            <Changelog changes={entry.data.changes} show={["mascot", "name"]} />
                            {#if entry.data.changes.owner}
                                {@const [before, after] = entry.data.changes.owner}
                                <li>
                                    <b>Owner:</b>
                                    <UserMention id={before} /> &rightarrow; <UserMention id={after} />
                                </li>
                            {/if}
                            {#if entry.data.changes.advisor}
                                {@const [before, after] = entry.data.changes.advisor}
                                <li>
                                    <b>Advisor:</b>
                                    {#if before}<UserMention id={before} />{:else}<span class="text-2">(none)</span>{/if} &rightarrow;
                                    {#if after}<UserMention id={after} />{:else}<span class="text-2">(none)</span>{/if}
                                </li>
                            {/if}
                            {#if entry.data.changes.delegated}
                                {@const [before, after] = entry.data.changes.delegated}
                                <li>
                                    <b>Voter:</b>
                                    {before ? "Council Advisor" : "Server Owner"} &rightarrow; {after ? "Council Advisor" : "Server Owner"}
                                </li>
                            {/if}
                        </ul>
                    {:else if entry.action === "observation-records/edit"}
                        edited observation record <code>{entry.data.uuid}</code> for {#if entry.data.name}<Mention type="guild" id={entry.data.id}
                                >{entry.data.name}</Mention
                            >{:else}<GuildMention id={entry.data.id} {guildNames} />{/if}:
                        <ul>
                            {#if entry.data.changes.observer}
                                {@const [before, after] = entry.data.changes.observer}
                                <li>
                                    <b>Observer:</b>
                                    {#if before}<UserMention id={before} />{:else}<span class="text-2">(none)</span>{/if} &rightarrow;
                                    {#if after}<UserMention id={after} />{:else}<span class="text-2">(none)</span>{/if}
                                </li>
                            {/if}
                            {#if entry.data.changes.start}
                                {@const [before, after] = entry.data.changes.start}
                                <li>
                                    <b>Start:</b>
                                    {#if before}<Timestamp ms mode="date" timestamp={before} />{:else}<span class="text-2">(none)</span>{/if} &rightarrow;
                                    {#if after}<Timestamp ms mode="date" timestamp={after} />{:else}<span class="text-2">(none)</span>{/if}
                                </li>
                            {/if}
                            {#if entry.data.changes.end}
                                {@const [before, after] = entry.data.changes.end}
                                <li>
                                    <b>Start:</b>
                                    {#if before}<Timestamp ms mode="date" timestamp={before} />{:else}<span class="text-2">(none)</span>{/if} &rightarrow;
                                    {#if after}<Timestamp ms mode="date" timestamp={after} />{:else}<span class="text-2">(none)</span>{/if}
                                </li>
                            {/if}
                            <Changelog changes={entry.data.changes} hide={["observer", "start", "end"]} code={["hidden", "status"]} />
                        </ul>
                    {:else if entry.action === "users/demote"}
                        demoted <UserMention id={entry.data.id} /> from the observer team.
                    {:else if entry.action === "users/promote"}
                        promoted <UserMention id={entry.data.id} /> to observer.
                    {:else if entry.action === "users/roles/add"}
                        added <code>{entry.data.role}</code> to <UserMention id={entry.data.id} />{#if entry.data.guild}
                            &nbsp;in <GuildMention id={entry.data.guild} {guildNames} />{/if}.
                    {:else if entry.action === "users/roles/remove"}
                        removed <code>{entry.data.role}</code> from <UserMention id={entry.data.id} />{#if entry.data.guild}
                            &nbsp;in <GuildMention id={entry.data.guild} {guildNames} />{/if}.
                    {:else if entry.action === "users/staff/add"}
                        added <UserMention id={entry.data.id} /> to the staff team of <GuildMention id={entry.data.guild} {guildNames} />.
                    {:else if entry.action === "users/staff/remove"}
                        removed <UserMention id={entry.data.id} /> from the staff team of <GuildMention id={entry.data.guild} {guildNames} />.
                    {:else if entry.action === "users/term/refresh"}
                        refreshed <UserMention id={entry.data.id} />'s term.
                    {:else}
                        <pre><code class="language-json">{JSON.stringify(entry, undefined, 4)}</code></pre>
                    {/if}
                </span>
            </p>
            {#if entry.action === "apply"}
                <Invite invite={data.code} />
                <p>
                    <span class="row gap-1">
                        <Expand bind:open={expanded[entry.uuid]} />
                        Show Full Application
                    </span>
                </p>
                <Show when={expanded[entry.uuid]}>
                    <div class="panel bg-2">
                        <b>NSFW</b>
                        <p>{entry.data.nsfw === "private" ? "Yes, private." : entry.data.nsfw === "public" ? "Yes, public." : "No."}</p>
                        <b>Prior Experience</b>
                        <Textarea value={entry.data.experience} disabled />
                        <b>Short-Term Server Goals</b>
                        <Textarea value={entry.data.shortgoals} disabled />
                        <b>Long-Term Server Goals</b>
                        <Textarea value={entry.data.longgoals} disabled />
                        <b>Server History</b>
                        <Textarea value={entry.data.history} disabled />
                        <b>Additional Comments</b>
                        <Textarea value={entry.data.additional} disabled />
                    </div>
                </Show>
            {/if}
            {#if entry.reason}
                <p>
                    <b class="text-2">Reason</b><br />
                    {entry.reason}
                </p>
            {/if}
            <hr />
            <div class="row gap-1">
                <Switch on={solo === entry.action} on:toggle={({ detail: x }) => (solo = x ? entry.action : null)}>Solo Type</Switch>
                <button class="row tp red-text" on:click={() => (show[entry.action] = false)}><Icon icon="visibility_off" /> Hide Type</button>
            </div>
        </div>
    </Show>
{/each}
<Loading done={!loading} />
<br />
{#if done}
    <span class="text-2">(You've reached the beginning of time.)</span>
{:else}
    <button on:click={loadMore}>Load More</button>
{/if}

<FixedButton icon="tune" click={() => (open = true)} index={1} />

<Modal bind:open>
    <h3 class="short">Filters</h3>
    <br />
    <div class="row gap-1">
        <button on:click={() => (show = Object.fromEntries(Object.keys(show).map((x) => [x, true])))}>Show all entries</button>
        <button class="tp red-text" on:click={() => (show = Object.fromEntries(Object.keys(show).map((x) => [x, false])))}>Hide all entries</button>
    </div>
    <ul class="space">
        <li>
            <div class="row gap-1">
                <b>Only show actions by user:</b>
                <span><input type="text" class="bg-1" placeholder="User ID" bind:value={executor} /></span>
            </div>
        </li>
        <li>
            <div class="row gap-1">
                <b>targeting ID:</b>
                <span><input type="text" class="bg-1" placeholder="Any ID" bind:value={id} /></span>
            </div>
        </li>
        <li>
            <div class="row gap-1">
                <b>in guild:</b>
                <span><input type="text" class="bg-1" placeholder="Guild ID" bind:value={guild} /></span>
            </div>
        </li>
    </ul>
    <hr />
    {#each Object.keys(actions) as action}
        <div class="row gap-1">
            <Switch bind:on={show[action]} />
            <Icon icon={actions[action].icon} />
            {actions[action].title}
        </div>
    {/each}
</Modal>

<style lang="scss">
    p.description {
        line-height: 200%;

        span {
            line-height: 175%;
        }
    }

    .diff {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
</style>
