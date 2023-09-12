<script lang="ts">
    import api from "$lib/api";
    import Badge from "$lib/components/Badge.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token, user } from "$lib/stores";
    import type { Character, Guild, Role, User } from "$lib/types";
    import { getTag } from "$lib/utils";
    import { onMount } from "svelte";

    let userId = $user!.id;

    const blocks: {
        stats: { guildCount: number; userCount: number; uptime: number };
        user: User;
        guilds: Guild[];
        roles: Role[];
        characters: Record<string, Character>;
    } = {} as any;

    const routes = { stats: "GET /stats", guilds: "GET /guilds", roles: "GET /roles", characters: "GET /characters" };
    const open: Record<string, boolean> = { stats: true };

    async function reload(block: keyof typeof blocks & keyof typeof routes) {
        (blocks[block] as any) = undefined;
        blocks[block] = await api($token, routes[block]);
    }

    async function reloadAll() {
        await reloadUser();
        for (const block of Object.keys(routes) as any[]) await reload(block);
    }

    onMount(() => {
        reloadAll();
    });

    async function reloadUser() {
        (blocks.user as any) = undefined;
        api($token, `GET /users/${userId}`).then((data) => (blocks.user = data));
    }

    async function loadUser() {
        let first = true;

        while (true) {
            const id = prompt(`Enter a ${first ? "" : "valid "}user ID${first ? "" : " (17-20 digits)"}.`);
            first = false;

            if (!id) return;
            if (!id.match(/^\d{17,20}$/)) continue;

            (blocks.user as any) = undefined;
            blocks.user = await api($token, `GET /users/${id}`);
            userId = id;

            return;
        }
    }

    async function removeRole(role: string, guild?: Guild) {
        if (!confirm(`Are you sure you want to remove the '${role}' role from ${blocks.user.tag}${guild ? ` in ${guild.name}` : ""}?`)) return;

        const req = await api($token, `!DELETE /users/${blocks.user.id}/roles/${role}${guild ? `/${guild.id}` : ""}`);
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    async function addRole(role: string, guild: boolean | Guild) {
        if (!confirm(`Are you sure you want to add the '${role}' role to ${blocks.user.tag}${typeof guild === "boolean" ? "" : ` in ${guild.name}`}?`)) return;

        const req = await api($token, `!PUT /users/${blocks.user.id}/roles/${role}${typeof guild === "boolean" ? "" : `/${guild.id}`}`);
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    async function setObserver(observer: boolean) {
        const message = `Are you sure you want to ${observer ? "promote" : "demote"} ${blocks.user.tag} ${
            observer ? "to" : "from"
        } the position of observer? Misuse may result in consequences!`;

        if (!confirm(message)) return;

        if (
            !observer &&
            blocks.user.id === $user!.id &&
            !confirm("Are you absolute certain? You are demoting yourself and will not be able to revert this action!")
        )
            return;

        const req = await api($token, `!PATCH /users/${blocks.user.id}`, { observer });
        if (!req.ok) return alert((await req.json()).message);

        if (!observer && blocks.user.id === $user!.id) location.reload();
        await reloadAll();
    }

    async function setStaff(staff: boolean, guild: Guild) {
        if (!confirm(`Are you sure you want to ${staff ? "add" : "remove"} ${blocks.user.tag} ${staff ? "to" : "from"} the staff team of ${guild.name}?`))
            return;

        const req = await api($token, `!${staff ? "PUT" : "DELETE"} /staff/${guild.id}/${blocks.user.id}`);
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    async function transfer(position: string, guild: Guild, remove?: boolean) {
        const id = remove ? null : prompt(`Enter the ID of the user to whom the ${guild.name} ${position} position will be transferred.`);

        if (!remove) {
            if (!id) return;
            if (!id.match(/^\d{17,20}$/)) return alert("Invalid user ID.");
        }

        if (!id) {
            if (!confirm(`Are you sure you want to remove the ${position} of ${guild.name}?`)) return;
        } else if (!confirm(`Are you sure you want to transfer the ${guild.name} ${position} position to ${await getTag(id)}?`)) return;

        const req = await api($token, `!PATCH /guilds/${guild.id}`, { [position]: id });
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    async function toggleDelegate(guild: Guild) {
        const req = await api($token, `!PATCH /guilds/${guild.id}`, { delegated: !guild.delegated });
        await reloadAll();
    }

    async function switchMascot(guild: Guild) {
        const id = prompt(`Enter the ID of the character to which to switch the mascot of ${guild.name}.`);

        if (!id) return;
        if (!(id in blocks.characters)) return alert("No such character.");

        const req = await api($token, `!PATCH /guilds/${guild.id}`, { mascot: id });
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    async function switchInvite(guild: Guild) {
        const code = prompt(
            `Enter the new invite code for ${guild.name}. Ensure it is a permanent, non-vanity invite targeting the guild and not a user or stage channel.`,
        );

        if (!code) return;

        const req = await api($token, `!PATCH /guilds/${guild.id}`, { invite: code });
        if (!req.ok) return alert((await req.json()).message);

        await reloadAll();
    }

    function mapify<T>(array: T[], index: string = "id"): Record<string, T> {
        return array?.reduce((o, x) => ({ ...o, [(x as any)[index]]: x }), {}) ?? {};
    }

    let guildMap: Record<string, Guild> = {};
    let roleMap: Record<string, Role> = {};

    $: guildMap = mapify(blocks.guilds);
    $: roleMap = mapify(blocks.roles);

    let addRoleMode: false | true | Guild = false;
</script>

<div class="container">
    <h1>API Manager</h1>
    <div class="panel">
        <h2 class="row gap-1"><Expand bind:open={open.stats} /> Stats <button on:click={() => reload("stats")}><Icon icon="refresh" /></button></h2>
        {#if open.stats}
            <Loading done={blocks.stats}>
                <ul>
                    <li><b>Guilds:</b> <code>{blocks.stats.guildCount}</code></li>
                    <li><b>Users:</b> <code>{blocks.stats.userCount}</code></li>
                    <li><b>Uptime:</b> <code>{blocks.stats.uptime}</code> (since {new Date(Date.now() - blocks.stats.uptime).toLocaleString()})</li>
                </ul>
            </Loading>
        {/if}
    </div>
    <div id="user" class="panel">
        <h2 class="row gap-1">
            <Expand bind:open={open.user} /> User <button on:click={reloadUser}><Icon icon="refresh" /></button>
            <button on:click={loadUser}><Icon icon="edit" /></button>
        </h2>
        {#if open.user}
            <Loading done={blocks.user}>
                {#if blocks.user.id === $user?.id}
                    <Callout><p>This is your own account.</p></Callout>
                    <br />
                {/if}
                <div class="panel bg-4">
                    <p class="row gap-1">
                        <span><b>{blocks.user.tag}</b> &mdash; <code>{blocks.user.id}</code></span>
                        {#if blocks.user.observer}<Badge icon="local_police" title={roleMap.observer?.description}>TCN Observer</Badge>{/if}
                        {#if blocks.user.owner}<Badge icon="badge" title={roleMap.owner?.description}>Server Owner</Badge>{/if}
                        {#if blocks.user.advisor}<Badge icon="partner_exchange" title={roleMap.advisor?.description}>Council Advisor</Badge>{/if}
                        {#if blocks.user.voter}<Badge icon="how_to_vote" title={roleMap.voter?.description}>Voter</Badge>{/if}
                        {#if blocks.user.council}<Badge icon="groups" title={roleMap.council?.description}>Council Member</Badge>{/if}
                        {#if blocks.user.staff}<Badge icon="verified_user" title={roleMap.staff?.description}>Network Staff</Badge>{/if}
                    </p>
                    <p class="row gap-1">
                        <span>Roles:</span>
                        {#each blocks.user.roles as role}
                            {#if roleMap[role]?.assignment !== "pseudo"}
                                <button class="void" on:click={() => removeRole(role)}>
                                    <Badge icon="close" title={roleMap[role]?.description}>{role}</Badge>
                                </button>
                            {/if}
                        {/each}
                        <button class="void" on:click={() => (addRoleMode = true)}><Badge icon="add">Add Role</Badge></button>
                    </p>
                    <hr />
                    <p class="row gap-1">
                        <button class="void" on:click={() => setObserver(!blocks.user.observer)}>
                            <Badge icon={blocks.user.observer ? "remove_moderator" : "add_moderator"}>{blocks.user.observer ? "Demote" : "Promote"}</Badge>
                        </button>
                    </p>
                </div>
                {#if Object.keys(blocks.user.guilds).length > 0}
                    <h3>Guilds</h3>
                    {#each Object.entries(blocks.user.guilds) as [guildId, props]}
                        {@const guild = guildMap[guildId]}
                        <div class="panel bg-4">
                            <Loading done={guild}>
                                <p class="row gap-1">
                                    <span>
                                        <a href="#guild-{guildId}" on:click={() => (open.guilds = true)}><b>{guild?.name}</b></a> &mdash;
                                        <code>{guildId}</code>
                                    </span>
                                    {#if props.owner}<Badge icon="badge" title={roleMap.owner?.description}>Server Owner</Badge>{/if}
                                    {#if props.advisor}<Badge icon="partner_exchange" title={roleMap.advisor?.description}>Council Advisor</Badge>{/if}
                                    {#if props.voter}<Badge icon="how_to_vote" title={roleMap.voter?.description}>Voter</Badge>{/if}
                                    {#if props.staff}<Badge icon="verified_user" title={roleMap.staff?.description}>Staff</Badge>{/if}
                                </p>
                                <p class="row gap-1">
                                    <span>Roles:</span>
                                    {#each props.roles as role}
                                        {#if roleMap[role]?.assignment !== "pseudo"}
                                            <button class="void" on:click={() => removeRole(role, guild)}>
                                                <Badge icon="close" title={roleMap[role]?.description}>{role}</Badge>
                                            </button>
                                        {/if}
                                    {/each}
                                    <button class="void" on:click={() => (addRoleMode = guild)}><Badge icon="add">Add Role</Badge></button>
                                </p>
                                <hr />
                                <p class="row gap-1">
                                    {#if !props.owner && !props.advisor}
                                        <button class="void" on:click={() => setStaff(!props.staff, guild)}>
                                            <Badge icon={props.staff ? "person_off" : "person_add"}>{props.staff ? "Remove from staff" : "Add to staff"}</Badge>
                                        </button>
                                    {/if}
                                </p>
                            </Loading>
                        </div>
                    {/each}
                {/if}
            </Loading>
        {/if}
    </div>
    <div class="panel">
        <h2 class="row gap-1"><Expand bind:open={open.guilds} /> Guilds <button on:click={() => reload("guilds")}><Icon icon="refresh" /></button></h2>
        {#if open.guilds}
            <Loading done={blocks.guilds}>
                {#each blocks.guilds as guild}
                    <div class="panel bg-4">
                        <h3 id="guild-{guild.id}">{guild.name} <span style="opacity: 60%">({blocks.characters?.[guild.mascot].name})</span></h3>
                        <ul class="space">
                            <li>
                                <span class="row gap-1">
                                    <span>
                                        <b>Owner:</b>
                                        <a href="#user" on:click={() => ((userId = guild.owner), reloadUser(), (open.user = true))}>
                                            <UserId id={guild.owner} />
                                        </a>
                                        &mdash; <code>{guild.owner}</code>
                                    </span>
                                    <button class="void" on:click={() => transfer("owner", guild)}><Badge icon="swap_horiz">Transfer Ownership</Badge></button>
                                </span>
                            </li>
                            <li>
                                <span class="row gap-1">
                                    <span>
                                        <b>Advisor:</b>
                                        {#if guild.advisor}
                                            <a href="#user" on:click={() => ((userId = guild.advisor || ""), reloadUser(), (open.user = true))}>
                                                <UserId id={guild.advisor} />
                                            </a>
                                            &mdash; <code>{guild.advisor}</code>
                                        {:else}
                                            (none)
                                        {/if}
                                    </span>
                                    <button class="void" on:click={() => transfer("advisor", guild)}>
                                        <Badge icon={guild.advisor ? "swap_horiz" : "add"}>{guild.advisor ? "Switch Advisor" : "Add Advisor"}</Badge>
                                    </button>
                                    {#if guild.advisor}
                                        <button class="void" on:click={() => transfer("advisor", guild, true)}>
                                            <Badge icon="clear">Remove Advisor</Badge>
                                        </button>
                                    {/if}
                                </span>
                            </li>
                            <li>
                                <span class="row gap-1">
                                    <span>
                                        <b>Voter:</b>
                                        {guild.delegated ? "Council Advisor" : "Server Owner"}
                                    </span>
                                    <button class="void" on:click={() => toggleDelegate(guild)}>
                                        <Badge icon={guild.delegated ? "keyboard_return" : "approval_delegation"}>
                                            {guild.delegated ? "Return" : "Delegate"}
                                        </Badge>
                                    </button>
                                </span>
                            </li>
                            <li>
                                <span class="row gap-1">
                                    <span>
                                        <b>Mascot:</b>
                                        {blocks.characters?.[guild.mascot].name}
                                    </span>
                                    <button class="void" on:click={() => switchMascot(guild)}>
                                        <Badge icon="switch_account">Switch</Badge>
                                    </button>
                                </span>
                            </li>
                            <li>
                                <span class="row gap-1">
                                    <span>
                                        <b>Invite:</b>
                                        <Link to="https://discord.gg/{guild.invite}" external>discord.gg/{guild.invite}</Link>
                                    </span>
                                    <button class="void" on:click={() => switchInvite(guild)}>
                                        <Badge icon="link">Switch</Badge>
                                    </button>
                                </span>
                            </li>
                        </ul>
                        <pre>{JSON.stringify(guild, undefined, 4)}</pre>
                    </div>
                {/each}
            </Loading>
        {/if}
    </div>
</div>

<Modal bind:open={addRoleMode}>
    <p>Adding role {typeof addRoleMode === "boolean" ? "globally" : `in ${addRoleMode.name}`} to <b>{blocks.user?.tag}</b></p>
    <hr />
    <p class="row gap-1">
        {#each blocks.roles ?? [] as { id, assignment }}
            {#if (assignment === "all" || assignment === (typeof addRoleMode === "boolean" ? "global" : "guild")) && !(typeof addRoleMode === "boolean" ? blocks.user?.roles.includes(id) : blocks.user?.guilds[addRoleMode.id].roles.includes(id))}
                <button class="void" on:click={() => addRole(id, addRoleMode)}><Badge icon="add" title={roleMap[id]?.description}>{id}</Badge></button>
            {/if}
        {/each}
    </p>
</Modal>

<style lang="scss">
    :global(h2 button) {
        padding: 0.2em;
    }
</style>
