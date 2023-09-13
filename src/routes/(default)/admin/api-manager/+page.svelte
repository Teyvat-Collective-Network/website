<script lang="ts" context="module">
    const roleTypes: Record<string, { icon: string; name: string; title: string }> = {
        pseudo: { icon: "lock", name: "Pseudo", title: "This role cannot be assigned directly and is automatically generated from other properties." },
        global: { icon: "public", name: "Global", title: "This role must be assigned globally." },
        guild: { icon: "language", name: "Guild", title: "This role must be assigned within a guild." },
        all: { icon: "lock_open", name: "Anywhere", title: "This role may be assigned globally or within a guild." },
    };
</script>

<script lang="ts">
    import api from "$lib/api";
    import Badge from "$lib/components/Badge.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Show from "$lib/components/Show.svelte";
    import TextBadge from "$lib/components/TextBadge.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token, user } from "$lib/stores";
    import type { Attribute, Character, Guild, Role, User } from "$lib/types";
    import { getTag } from "$lib/utils";
    import { onMount } from "svelte";

    let userId = $user!.id;

    const blocks: {
        stats: { guildCount: number; userCount: number; uptime: number; startup: number };
        users: User[];
        user: User;
        guilds: Guild[];
        roles: Role[];
        attributes: Record<string, Record<string, Attribute>>;
        characters: Record<string, Character>;
    } = {} as any;

    const routes = {
        stats: "GET /stats",
        users: "GET /users",
        guilds: "GET /guilds",
        roles: "GET /roles",
        attributes: "GET /attributes",
        characters: "GET /characters",
    };

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

    async function commit(route: string, data?: any, reload: boolean = true) {
        const req = await api($token, `!${route}`, data);

        if (!req.ok) {
            alert((await req.json()).message);
            return false;
        }

        if (reload) await reloadAll();
        return true;
    }

    async function removeRole(role: string, guild?: Guild) {
        if (!confirm(`Are you sure you want to remove the '${role}' role from ${blocks.user.tag}${guild ? ` in ${guild.name}` : ""}?`)) return;
        await commit(`DELETE /users/${blocks.user.id}/roles/${role}${guild ? `/${guild.id}` : ""}`);
    }

    async function addRole(role: string, guild: boolean | Guild) {
        if (!confirm(`Are you sure you want to add the '${role}' role to ${blocks.user.tag}${typeof guild === "boolean" ? "" : ` in ${guild.name}`}?`)) return;
        await commit(`PUT /users/${blocks.user.id}/roles/${role}${typeof guild === "boolean" ? "" : `/${guild.id}`}`);
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

        if (await commit(`PATCH /users/${blocks.user.id}`, { observer }, false)) {
            if (!observer && blocks.user.id === $user!.id) location.reload();
            await reloadAll();
        }
    }

    async function setStaff(staff: boolean, guild: Guild) {
        if (!confirm(`Are you sure you want to ${staff ? "add" : "remove"} ${blocks.user.tag} ${staff ? "to" : "from"} the staff team of ${guild.name}?`))
            return;

        await commit(`${staff ? "PUT" : "DELETE"} /staff/${guild.id}/${blocks.user.id}`);
    }

    async function setPosition(position: "owner" | "advisor", guild: Guild) {
        if (!confirm(`Are you sure you want to make ${blocks.user.tag} the ${position} of ${guild.name}?`)) return;

        const other = position === "owner" ? "advisor" : "owner";
        const data = { [position]: blocks.user.id };
        if (guild[other] === blocks.user.id) data[other] = guild[position]!;

        await commit(`PATCH /guilds/${guild.id}`, data);
    }

    async function editName(guild: Guild) {
        const name = prompt(`Enter the new name for ${guild.name}.`);
        if (!name) return;
        if (name.length > 32) return alert("Name must not exceed 32 characters.");

        await commit(`PATCH /guilds/${guild.id}`, { name });
    }

    async function transfer(position: "owner" | "advisor", guild: Guild, remove?: boolean) {
        const id = remove ? null : prompt(`Enter the ID of the user to whom the ${guild.name} ${position} position will be transferred.`);

        if (!remove) {
            if (!id) return;
            if (!id.match(/^\d{17,20}$/)) return alert("Invalid user ID.");
        }

        if (!id) {
            if (!confirm(`Are you sure you want to remove the ${position} of ${guild.name}?`)) return;
        } else if (!confirm(`Are you sure you want to transfer the ${guild.name} ${position} position to ${await getTag(id)}?`)) return;

        await commit(`PATCH /guilds/${guild.id}`, { [position]: id });
    }

    async function switchRoles(guild: Guild) {
        if (!confirm(`Are you sure you want to switch the owner and advisor of ${guild.name}?`)) return;

        await commit(`PATCH /guilds/${guild.id}`, { owner: guild.advisor, advisor: guild.owner });
    }

    async function toggleDelegate(guild: Guild) {
        await commit(`PATCH /guilds/${guild.id}`, { delegated: !guild.delegated });
    }

    async function switchMascot(guild: Guild) {
        const id = prompt(`Enter the ID of the character to which to switch the mascot of ${guild.name}.`);

        if (!id) return;
        if (!(id in blocks.characters)) return alert("No such character.");

        await commit(`PATCH /guilds/${guild.id}`, { mascot: id });
    }

    async function switchInvite(guild: Guild) {
        const code = prompt(
            `Enter the new invite code for ${guild.name}. Ensure it is a permanent, non-vanity invite targeting the guild and not a user or stage channel.`,
        );

        if (!code) return;

        await commit(`PATCH /guilds/${guild.id}`, { invite: code });
    }

    async function editRoleDescription(role: Role) {
        const description = prompt(`Enter the new description for ${role.id}.`);
        if (!description) return;

        await commit(`PATCH /roles/${role.id}`, { description });
    }

    async function deleteRole(role: Role) {
        let count = 0;

        for (const u of blocks.users ?? []) {
            if (u.roles.includes(role.id)) count++;
            for (const guild of Object.values(u.guilds)) if (guild.roles.includes(role.id)) count++;
        }

        const message = `Are you sure you want to delete the role '${role.id}'? This role is assigned ${count} time${
            count === 1 ? "" : "s"
        }. This action is destructive and cannot be undone!`;

        if (!confirm(message)) return;
        await commit(`DELETE /roles/${role.id}`);
    }

    async function finishCreateRole() {
        if (!createRoleObj.id?.match(/^[a-z-]{1,32}$/))
            return (createRoleError = "ID is required, must consist of lowercase letters and dashes, and must not exceed 32 characters.");

        if (!createRoleObj.description || createRoleObj.description.length > 256)
            return (createRoleError = "Description is required and must not exceed 32 characters.");

        if (!createRoleObj.assignment) return (createRoleError = "Type is required.");

        const req = await api($token, `!POST /roles/${createRoleObj.id}`, createRoleObj);
        if (!req.ok) return (createRoleError = (await req.json()).message);

        createRoleError = "";
        createRole = false;
        createRoleObj = {};
        await reloadAll();
    }

    async function saveAttribute() {
        if (!editAttributeObj.type?.match(/^[a-z-]{1,32}$/))
            return (saveAttributeError = "Type is required, must consist of lowercase letters and dashes, and must not exceed 32 characters.");

        if (!editAttributeObj.id?.match(/^[a-z-]{1,32}$/))
            return (saveAttributeError = "ID is required, must consist of lowercase letters and dashes, and must not exceed 32 characters.");

        if (!editAttributeObj.name || editAttributeObj.name.length > 64) return (saveAttributeError = "Name is required and must not exceed 64 characters.");
        if ((editAttributeObj.emoji ??= "").length > 64) return (saveAttributeError = "Emoji must not exceed 64 characters.");

        const req = await api(
            $token,
            `!${editAttributeMode === "new" ? "POST" : "PATCH"} /attributes/${editAttributeObj.type}/${editAttributeObj.real ?? editAttributeObj.id}`,
            editAttributeObj,
        );
        if (!req.ok) return (saveAttributeError = (await req.json()).message);

        saveAttributeError = "";
        editAttributeMode = false;
        editAttributeObj = {};
        await reloadAll();
    }

    async function deleteAttribute(type: string, id: string) {
        let count = 0;
        for (const c of Object.values(blocks.characters ?? {})) if (c.attributes[type] === id) count++;

        const message = `Are you sure you want to delete the '${type}' attribute with ID '${id}'? This attribute is used by ${count} character${
            count === 1 ? "" : "s"
        }. This action is destructive and cannot be undone!`;

        if (!confirm(message)) return;
        await commit(`DELETE /attributes/${type}/${id}`);
    }

    async function createCharacter() {
        const id = prompt("Enter the new character's ID (max. 32 characters, a-z and dashes).");
        if (!id) return;
        if (!id.match(/^[a-z-]{1,32}$/)) return alert("Invalid ID.");

        const name = prompt("Enter the new character's name (max. 255 characters).");
        if (!name) return;
        if (name.length > 255) return alert("Name must not exceed 255 characters.");

        const short = prompt("Enter the new character's short name (if applicable) (max. 255 characters).") || undefined;
        if (short && short.length > 255) return alert("Short name must not exceed 255 characters.");

        await commit(`POST /characters/${id}`, { name, short });
    }

    async function saveCharacter() {
        if (!editCharacterObj.id?.match(/^[a-z-]{1,32}$/))
            return (saveCharacterError = "ID is required, must consist of lowercase letters and dashes, and must not exceed 32 characters.");

        if (!editCharacterObj.name || editCharacterObj.name.length > 255) return (saveCharacterError = "Name must not exceed 255 characters.");
        if (editCharacterObj.short?.length > 255) return (saveCharacterError = "Short name must not exceed 255 characters.");

        editCharacterObj.short ||= null;

        for (const key of Object.keys(editCharacterObj.attributes)) editCharacterObj.attributes[key] ||= null;

        const req = await api($token, `!PATCH /characters/${editCharacterObj.real}`, editCharacterObj);
        if (!req.ok) return (saveCharacterError = (await req.json()).message);

        saveCharacterError = "";
        editCharacter = false;
        editCharacterObj = {};
        await reloadAll();
    }

    async function deleteCharacter(character: Character) {
        if (blocks.guilds?.some((guild) => guild.mascot === character.id)) return alert("That character is still in use by at least one guild.");
        if (!confirm(`Are you sure you want to delete ${character.name}?`)) return;

        await commit(`DELETE /characters/${character.id}`);
    }

    function mapify<T>(array: T[], index: string = "id"): Record<string, T> {
        return array?.reduce((o, x) => ({ ...o, [(x as any)[index]]: x }), {}) ?? {};
    }

    let guildMap: Record<string, Guild> = {};
    let roleMap: Record<string, Role> = {};

    $: guildMap = mapify(blocks.guilds);
    $: roleMap = mapify(blocks.roles);

    let addRoleMode: false | true | Guild = false;
    let addUserGuild = false;
    let createRole = false;
    let editAttributeMode: "new" | "edit" | false = false;
    let editCharacter = false;

    let createRoleObj: any = {};
    let createRoleError = "";

    let editAttributeObj: any = {};
    let saveAttributeError = "";

    let editCharacterObj: any = {};
    let saveCharacterError = "";
</script>

<div class="container">
    <h1>API Manager</h1>
    <div class="panel">
        <h2 class="row gap-1"><Expand bind:open={open.stats} /> Stats <button on:click={() => reload("stats")}><Icon icon="refresh" /></button></h2>
        <Show when={open.stats}>
            <Loading done={blocks.stats}>
                <ul>
                    <li><b>Guilds:</b> <code>{blocks.stats.guildCount}</code></li>
                    <li><b>Users:</b> <code>{blocks.stats.userCount}</code></li>
                    <li><b>Uptime:</b> <code>{blocks.stats.uptime}</code> (since {new Date(blocks.stats.startup).toLocaleString()})</li>
                </ul>
            </Loading>
        </Show>
    </div>
    <div id="user" class="panel">
        <h2 class="row gap-1">
            <Expand bind:open={open.user} /> User <button on:click={reloadUser}><Icon icon="refresh" /></button>
            <button on:click={loadUser}><Icon icon="edit" /></button>
        </h2>
        <Show when={open.user}>
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
                                        <Link to="#guild-{guildId}" on:click={() => ((open.guilds = true), (open[`guilds_${guildId}`] = true))}>
                                            <b>{guild?.name}</b>
                                        </Link> &mdash;
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
                                    {#if !props.owner}
                                        <button class="void" on:click={() => setPosition("owner", guild)}>
                                            <Badge icon="swap_horiz">{props.advisor ? "Swap With Owner" : "Give Ownership"}</Badge>
                                        </button>
                                    {/if}
                                    {#if props.advisor}
                                        <button class="void" on:click={() => transfer("advisor", guild, true)}>
                                            <Badge icon="person_off">Remove Advisor</Badge>
                                        </button>
                                    {:else if !props.owner || guild.advisor}
                                        <button class="void" on:click={() => setPosition("advisor", guild)}>
                                            <Badge icon="swap_horiz">{props.owner ? "Swap With Advisor" : "Make Advisor"}</Badge>
                                        </button>
                                    {/if}
                                </p>
                            </Loading>
                        </div>
                    {/each}
                {/if}
                <button class="void" on:click={() => (addUserGuild = true)}><Badge icon="add">Add Guild</Badge></button>
            </Loading>
        </Show>
    </div>
    <div class="panel">
        <h2 class="row gap-1"><Expand bind:open={open.guilds} /> Guilds <button on:click={() => reload("guilds")}><Icon icon="refresh" /></button></h2>
        <Show when={open.guilds}>
            <Loading done={blocks.guilds}>
                {#each blocks.guilds as guild}
                    <div class="panel bg-4">
                        <h3 id="guild-{guild.id}" class="row gap-1">
                            <Expand bind:open={open[`guilds_${guild.id}`]} />
                            {guild.name} <span style="opacity: 60%">({blocks.characters?.[guild.mascot].name})</span>
                        </h3>
                        <Show when={open[`guilds_${guild.id}`]}>
                            <ul class="space">
                                <li>
                                    <span class="row gap-1">
                                        <span><b>Name:</b> {guild.name}</span>
                                        <button class="void" on:click={() => editName(guild)}>
                                            <Badge icon="edit">Edit</Badge>
                                        </button>
                                    </span>
                                </li>
                                <li>
                                    <span class="row gap-1">
                                        <span>
                                            <b>Owner:</b>
                                            <Link to="#user" on:click={() => ((userId = guild.owner), reloadUser(), (open.user = true))}>
                                                <UserId id={guild.owner} />
                                            </Link>
                                            &mdash; <code>{guild.owner}</code>
                                        </span>
                                        <button class="void" on:click={() => transfer("owner", guild)}>
                                            <Badge icon="swap_horiz">Transfer Ownership</Badge>
                                        </button>
                                        {#if guild.advisor}
                                            <button class="void" on:click={() => switchRoles(guild)}>
                                                <Badge icon="swap_horiz">Switch Owner and Advisor</Badge>
                                            </button>
                                        {/if}
                                    </span>
                                </li>
                                <li>
                                    <span class="row gap-1">
                                        <span>
                                            <b>Advisor:</b>
                                            {#if guild.advisor}
                                                <Link to="#user" on:click={() => ((userId = guild.advisor || ""), reloadUser(), (open.user = true))}>
                                                    <UserId id={guild.advisor} />
                                                </Link>
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
                                                <Badge icon="person_off">Remove Advisor</Badge>
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
                                <li>
                                    <b>Staff:</b>
                                    <ul>
                                        {#each Object.keys(guild.users) as id}
                                            <li><Link to="#user" on:click={() => ((userId = id), reloadUser(), (open.user = true))}><UserId {id} /></Link></li>
                                        {/each}
                                    </ul>
                                </li>
                            </ul>
                        </Show>
                    </div>
                {/each}
            </Loading>
        </Show>
    </div>
    <div class="panel">
        <h2 class="row gap-1"><Expand bind:open={open.roles} /> Roles <button on:click={() => reload("roles")}><Icon icon="refresh" /></button></h2>
        <Show when={open.roles}>
            <Loading done={blocks.roles}>
                <div style="display: grid; grid-template-columns: auto 1fr auto auto auto; gap: 10px 25px">
                    <span><b>ID</b></span>
                    <span><b>Description</b></span>
                    <span><b>Type</b></span>
                    <span />
                    <span />
                    {#each blocks.roles.sort((x, y) => (x.assignment === "pseudo" ? 0 : 1) - (y.assignment === "pseudo" ? 0 : 1) || x.id.localeCompare(y.id)) as role}
                        {@const badge = roleTypes[role.assignment]}
                        <span><code>{role.id}</code></span>
                        <span>{role.description}</span>
                        <span><Badge icon={badge.icon} title={badge.title}>{badge.name}</Badge></span>
                        <span>
                            <button on:click={() => editRoleDescription(role)}><Icon icon="edit" /></button>
                        </span>
                        <span>
                            {#if role.assignment !== "pseudo"}
                                <button class="tp red-text" on:click={() => deleteRole(role)}><Icon icon="delete" /></button>
                            {/if}
                        </span>
                    {/each}
                </div>
                <p><button on:click={() => (createRole = true)}><Icon icon="add" /></button></p>
            </Loading>
        </Show>
    </div>
    <div class="panel">
        <h2 class="row gap-1">
            <Expand bind:open={open.attributes} /> Attributes <button on:click={() => reload("attributes")}><Icon icon="refresh" /></button>
        </h2>
        <Show when={open.attributes}>
            <Loading done={blocks.attributes}>
                <div style="display: grid; grid-template-columns: auto 1fr 1fr auto auto; gap: 10px 25px">
                    {#each [...new Set(Object.keys(blocks.attributes))].sort() as type}
                        <h3 style="grid-column: 1 / 6">Attributes of type <code>{type}</code></h3>
                        <span><b>ID</b></span>
                        <span><b>Name</b></span>
                        <span><b>Emoji</b></span>
                        <span />
                        <span />
                        {#each [...new Set(Object.keys(blocks.attributes[type]))].sort() as id}
                            {@const attribute = blocks.attributes[type][id]}
                            <span><code>{id}</code></span>
                            <span>{attribute.name}</span>
                            <span><code>{attribute.emoji}</code></span>
                            <span>
                                <button
                                    on:click={() => ((editAttributeObj = { type, real: id, id, ...structuredClone(attribute) }), (editAttributeMode = "edit"))}
                                >
                                    <Icon icon="edit" />
                                </button>
                            </span>
                            <span><button class="tp red-text" on:click={() => deleteAttribute(type, id)}><Icon icon="delete" /></button></span>
                        {/each}
                    {/each}
                </div>
                <br />
                <button on:click={() => ((editAttributeObj = {}), (editAttributeMode = "new"))}><Icon icon="add" /></button>
            </Loading>
        </Show>
    </div>
    <div class="panel">
        <h2 class="row gap-1">
            <Expand bind:open={open.characters} /> Characters <button on:click={() => reload("characters")}><Icon icon="refresh" /></button>
        </h2>
        <Show when={open.characters}>
            <Loading done={blocks.characters}>
                <div style="display: grid; grid-template-columns: auto auto auto 1fr auto auto; gap: 10px 25px">
                    <span><b>ID</b></span>
                    <span><b>Name</b></span>
                    <span><b>Short Name</b></span>
                    <span><b>Attributes</b></span>
                    <span />
                    <span />
                    {#each Object.keys(blocks.characters).sort() as id}
                        {@const character = blocks.characters[id]}
                        <span><code>{id}</code></span>
                        <span>{character.name}</span>
                        <span>{character.short || ""}</span>
                        <span class="row gap-1">
                            {#each Object.entries(character.attributes) as [type, id]}
                                <TextBadge label={type}>{id}</TextBadge>
                            {/each}
                        </span>
                        <span>
                            <button on:click={() => ((editCharacterObj = { real: id, ...structuredClone(character) }), (editCharacter = true))}>
                                <Icon icon="edit" />
                            </button>
                        </span>
                        <span><button class="tp red-text" on:click={() => deleteCharacter(character)}><Icon icon="delete" /></button></span>
                    {/each}
                </div>
                <br />
                <button on:click={() => createCharacter()}><Icon icon="add" /></button>
            </Loading>
        </Show>
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

<Modal bind:open={addUserGuild}>
    <p>Adding <b>{blocks.user?.tag}</b> to guild</p>
    <hr />
    <p class="row gap-1">
        {#each blocks.guilds ?? [] as guild}
            {#if blocks.user && !(guild.id in blocks.user.guilds)}
                <button class="void" on:click={() => (blocks.user.guilds[guild.id] = { owner: false, advisor: false, voter: false, staff: false, roles: [] })}>
                    <Badge icon="add">{guild.name}</Badge>
                </button>
            {/if}
        {/each}
    </p>
</Modal>

<Modal bind:open={createRole}>
    <p>Creating role</p>
    <hr />
    <div class="gap-1" style="display: grid; grid-template-columns: auto 1fr">
        <label for="__create-role-id"><b>ID</b></label>
        <input id="__create-role-id" type="text" class="bg-2" bind:value={createRoleObj.id} />
        <label for="__create-role-description"><b>Description</b></label>
        <input id="__create-role-description" type="text" class="bg-2" bind:value={createRoleObj.description} />
        <label for="__create-role-assignment"><b>Type</b></label>
        <select id="__create-role-assignment" class="bg-2" bind:value={createRoleObj.assignment}>
            <option value="global">Global</option>
            <option value="guild">Guild</option>
            <option value="all">Anywhere</option>
        </select>
    </div>
    <br />
    <div class="row gap-1">
        <button on:click={() => finishCreateRole()}><Icon icon="save" /></button>
        <span class="red-text">{createRoleError}</span>
    </div>
</Modal>

<Modal bind:open={editAttributeMode}>
    <p>
        {#if editAttributeMode === "edit"}
            <p>Editing attribute <code>{editAttributeObj.type}:{editAttributeObj.real}</code></p>
        {:else}
            <p>Creating attribute</p>
        {/if}
    </p>
    <hr />
    <div class="gap-1" style="display: grid; grid-template-columns: auto 1fr">
        {#if editAttributeMode === "new"}
            <label for="__edit-attr-type"><b>Type</b></label>
            <input id="__edit-attr-type" type="text" class="bg-2 mono" bind:value={editAttributeObj.type} />
        {/if}
        <label for="__edit-attr-id"><b>ID</b></label>
        <input id="__edit-attr-id" type="text" class="bg-2 mono" bind:value={editAttributeObj.id} />
        <label for="__edit-attr-name"><b>Name</b></label>
        <input id="__edit-attr-name" type="text" class="bg-2" bind:value={editAttributeObj.name} />
        <label for="__edit-attr-emoji"><b>Emoji</b></label>
        <input id="__edit-attr-emoji" type="text" class="bg-2 mono" bind:value={editAttributeObj.emoji} />
    </div>
    <br />
    <div class="row gap-1">
        <button on:click={() => saveAttribute()}><Icon icon="save" /></button>
        <span class="red-text">{saveAttributeError}</span>
    </div>
</Modal>

<Modal bind:open={editCharacter}>
    <p>Editing {editCharacterObj.name} (<code>{editCharacterObj.real}</code>)</p>
    <hr />
    <div class="gap-1" style="display: grid; grid-template-columns: auto 1fr">
        <label for="__edit-char-id"><b>ID</b></label>
        <input id="__edit-attr-id" type="text" class="bg-2 mono" bind:value={editCharacterObj.id} />
        <label for="__edit-char-name"><b>Name</b></label>
        <input id="__edit-char-name" type="text" class="bg-2" bind:value={editCharacterObj.name} />
        <label for="__edit-char-short"><b>Short Name</b></label>
        <input id="__edit-char-short" type="text" class="bg-2" bind:value={editCharacterObj.short} />
        {#if editCharacterObj.attributes}
            {#each Object.entries(blocks.attributes ?? {}) as [type, attributes]}
                <label for="__edit-char-attr-{type}"><b>{type[0].toUpperCase()}{type.slice(1)}</b></label>
                <select id="__edit-char-attr-{type}" class="bg-2" bind:value={editCharacterObj.attributes[type]}>
                    <option value="" />
                    {#each Object.entries(attributes) as [id, { name }]}
                        <option value={id}>{name}</option>
                    {/each}
                </select>
            {/each}
        {/if}
    </div>
    <br />
    <div class="row gap-1">
        <button on:click={() => saveCharacter()}><Icon icon="save" /></button>
        <span class="red-text">{saveCharacterError}</span>
    </div>
</Modal>

<style lang="scss">
    :global(h2 button, h3 button) {
        padding: 0.2em;
    }
</style>
