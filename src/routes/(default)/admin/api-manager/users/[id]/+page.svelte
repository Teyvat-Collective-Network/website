<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Badge from "$lib/components/Badge.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import RoleBadges from "$lib/components/RoleBadges.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { user as self, token } from "$lib/stores";
    import type { Guild, User } from "$lib/types";
    import { onMount } from "svelte";

    const { id } = $page.params;
    let tag: string | null;

    let user: User;
    let guilds: Guild[];

    async function reload(full: boolean = false) {
        if (full) user = null as any;
        user = await api($token, `GET /users/${id}`).catch(alert);

        if (full) guilds = await api($token, `GET /guilds`).catch(alert);
    }

    onMount(() => reload(true));

    async function addRole(guild: string = "") {
        const role = prompt(`Enter the role to add to this user${guild ? ` in ${guilds.find((x) => x.id === guild)?.name ?? "[Missing Guild]"}` : ""}.`);
        if (!role) return;

        await api($token, `PUT /users/${id}/roles/${role}${guild ? `/${guild}` : ""}`).catch(alert);
        await reload();
    }

    async function deleteRole(role: string, guild: string = "") {
        await api($token, `DELETE /users/${id}/roles/${role}${guild ? `/${guild}` : ""}`).catch(alert);
        await reload();
    }

    async function setObserver(observer: boolean) {
        if (!confirm(`Are you sure you want to ${observer ? "promote" : "demote"} ${tag ?? id}?`)) return;

        if (
            id === $self!.id &&
            !observer &&
            !confirm(
                "Are you ABSOLUTELY CERTAIN you wish to demote yourself? You will immediately lose access to this page and will not be able to undo this action!",
            )
        )
            return;

        await api($token, `PATCH /users/${id}`, { observer }).catch(alert);

        if (id === $self!.id && !observer) goto("/");

        await reload();
    }

    async function setStaff(guild: string, staff: boolean) {
        if (
            !confirm(
                `Are you sure you want to ${staff ? "add" : "remove"} ${tag ?? id} ${staff ? "to" : "from"} the staff team of ${
                    guilds.find((x) => x.id === guild)?.name ?? "[Missing Guild]"
                }?`,
            )
        )
            return;

        await api($token, `PUT /users/${id}/staff/${guild}`, { staff }).catch(alert);
        await reload();
    }
</script>

<b>Managing <Mention {id}><UserId {id} bind:tag /></Mention> &mdash; <A to="/admin/api-manager">Return to main page</A></b>
<br /><br />
<hr />
<br />
<div class="row gap-1">
    <button class="row" on:click={() => reload(true)}><Icon icon="refresh" /> Reload from API</button>
    {#if user}
        <button class="row tp red-text" on:click={() => setObserver(!user.observer)}>
            <Icon icon={user.observer ? "remove_moderator" : "add_moderator"} />
            {user.observer ? "Demote" : "Promote"}
        </button>
    {/if}
</div>
<br />
<Loading done={user}>
    {#if user.observer || user.owner || user.advisor || user.voter || user.council || user.staff}
        <div class="row gap-1">
            {#if user.observer}<Badge icon="local_police">TCN Observer</Badge>{/if}
            <RoleBadges context={user} />
        </div>
        <br />
    {/if}
    <div class="row gap-1">
        <b>Roles:</b>
        {#each user.roles as role}
            <button class="void" on:click={() => deleteRole(role)}><Badge icon="clear">{role}</Badge></button>
        {/each}
        <button class="void" on:click={() => addRole()}><Badge class="text-accent" color="transparent" icon="add">Add Role</Badge></button>
    </div>
    <br />
    <Loading done={guilds}>
        {#each [true, false] as filter}
            {@const list = guilds.filter((x) => x.id in user.guilds === filter)}
            {#if !filter && list.length > 0}
                <h3>Unaffiliated Servers</h3>
            {/if}
            {#each list as guild}
                {@const userGuild = user.guilds[guild.id] ?? { owner: false, advisor: false, council: false, voter: false, staff: false, roles: [] }}
                <div class="panel">
                    <h3 class="short">{guild.name}</h3>
                    <div>
                        <A to="/admin/api-manager/guilds/{guild.id}">Edit Guild</A> &mdash; <A to="https://discord.gg/{guild.invite}" external>Join Server</A>
                    </div>
                    <br />
                    {#if userGuild.owner || userGuild.advisor || userGuild.voter || userGuild.council || userGuild.staff}
                        <div class="row gap-1">
                            <RoleBadges context={userGuild} />
                        </div>
                        <br />
                    {/if}
                    <div class="row gap-1">
                        {#if filter}
                            <b>Roles:</b>
                        {/if}
                        {#each userGuild.roles as role}
                            <button class="void" on:click={() => deleteRole(role, guild.id)}><Badge icon="clear">{role}</Badge></button>
                        {/each}
                        <button class="void" on:click={() => addRole(guild.id)}>
                            <Badge class="text-accent" color="transparent" icon="add">Add Role</Badge>
                        </button>
                        {#if !userGuild.owner && !userGuild.advisor}
                            <button class="void" on:click={() => setStaff(guild.id, !userGuild.staff)}>
                                <Badge class="text-accent" color="transparent" icon={userGuild.staff ? "clear" : "add"}>
                                    {userGuild.staff ? "Remove From" : "Add As"} Staff
                                </Badge>
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}
        {/each}
    </Loading>
</Loading>
