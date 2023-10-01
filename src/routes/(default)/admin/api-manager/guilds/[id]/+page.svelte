<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Badge from "$lib/components/Badge.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token } from "$lib/stores";
    import type { Character, Guild } from "$lib/types";
    import { onMount } from "svelte";

    const { id } = $page.params;

    let guild: Guild;
    let mascot: Character;
    let name: string;

    const tags: Record<string, string | null> = {};

    async function reload(full = false) {
        if (full) guild = null as any;
        guild = await api($token, `GET /guilds/${id}`).catch(alert);
        if (guild) mascot = await api($token, `GET /characters/${guild.mascot}`);
    }

    $: name = guild?.name ?? name;

    onMount(() => reload(true));

    async function deleteGuild() {
        if (!confirm(`Are you sure you want to delete ${name ?? id}? This action cannot be undone!`)) return;

        try {
            await api($token, `DELETE /guilds/${id}`);
            goto("/admin/api-manager");
        } catch (error) {
            alert(error);
        }
    }

    async function edit(key: string, string: string) {
        const value = prompt(string);
        if (!value) return;

        await api($token, `PATCH /guilds/${id}`, { [key]: value }).catch(alert);
        await reload();
    }

    async function removeAdvisor() {
        if (!confirm(`Are you sure you want to remove the advisor for ${name ?? id}?`)) return;

        await api($token, `PATCH /guilds/${id}`, { advisor: null }).catch(alert);
        await reload();
    }

    async function swapRepresentatives() {
        if (!confirm(`Are you sure you want to swap the owner and advisor for ${name ?? id}?`)) return;

        await api($token, `PATCH /guilds/${id}`, { owner: guild.advisor, advisor: guild.owner }).catch(alert);
        await reload();
    }

    async function toggleDelegated() {
        await api($token, `PATCH /guilds/${id}`, { delegated: !guild.delegated }).catch(alert);
        await reload();
    }

    async function setStaff(user: string, staff: boolean) {
        if (!confirm(`Are you sure you want to ${staff ? "add" : "remove"} ${tags[user] ?? user} ${staff ? "to" : "from"} the staff team of ${guild.name}?`))
            return;

        await api($token, `PUT /users/${user}/staff/${id}`, { staff });
        await reload();
    }

    async function addRole(user: string) {
        const role = prompt(`Enter the role to add to ${tags[user] ?? user} in ${guild.name}.`);
        if (!role) return;

        await api($token, `PUT /users/${user}/roles/${role}/${id}`).catch(alert);
        await reload();
    }

    async function deleteRole(role: string, user: string) {
        await api($token, `DELETE /users/${user}/roles/${role}/${id}`).catch(alert);
        await reload();
    }

    async function addStaff() {
        const user = prompt(`Enter the ID of the user to add as a staff member to ${guild.name}.`);
        if (!user) return;

        await api($token, `PUT /users/${user}/staff/${id}`, { staff: true });
        await reload();
    }

    async function addRoleToNewUser() {
        const user = prompt(`Enter the ID of the user to which to add a role.`);
        if (!user) return;

        await addRole(user);
    }
</script>

<b>Managing {name} &mdash; <A to="/admin/api-manager">Return to main page</A></b>
<br /><br />
<hr />
<br />
<div class="row gap-1">
    <button class="row" on:click={() => reload(true)}><Icon icon="refresh" /> Reload from API</button>
    <button class="row tp red-text" on:click={deleteGuild}><Icon icon="delete" /> Delete Guild</button>
</div>
<br />
<Loading done={guild}>
    <div class="contents">
        <b>Name</b>
        {guild.name}
        <div class="row gap-1">
            <button class="tp text-accent" on:click={() => edit("name", "Enter the new guild name.")}><Icon icon="edit" /></button>
        </div>
        <b>Mascot</b>
        <div class="row gap-1">
            <Image src="/files/{guild.mascot}.png" alt="{guild.mascot}'s icon" style="height: 1.5em" transparent />
            {#if mascot}{mascot.name}{:else}<code>{guild.mascot}</code>{/if}
        </div>
        <div class="row gap-1">
            <button class="tp text-accent" on:click={() => edit("mascot", "Enter the ID of the new mascot for this guild.")}><Icon icon="edit" /></button>
        </div>
        <b>Invite</b>
        <A to="https://discord.gg/{guild.invite}" external>https://discord.gg/{guild.invite}</A>
        <div class="row gap-1">
            <button class="tp text-accent" on:click={() => edit("invite", "Enter the new invite code.")}><Icon icon="edit" /></button>
        </div>
        <b>Owner</b>
        <div class="row gap-1">
            <Mention id={guild.owner}><UserId id={guild.owner} /></Mention>
            <A to="/admin/api-manager/users/{guild.owner}">Edit User</A>
        </div>
        <div class="row gap-1">
            <button class="tp text-accent" on:click={() => edit("owner", "Enter the new owner ID.")}><Icon icon="edit" /></button>
            {#if guild.advisor}
                <button class="row tp blue-text" on:click={swapRepresentatives}><Icon icon="swap_horiz" /></button>
            {/if}
        </div>
        <b>Advisor</b>
        <div class="row gap-1">
            {#if guild.advisor}
                <Mention id={guild.advisor}><UserId id={guild.advisor} /></Mention>
                <A to="/admin/api-manager/users/{guild.advisor}">Edit User</A>
            {:else}
                (none)
            {/if}
        </div>
        <div class="row gap-1">
            <button class="tp text-accent" on:click={() => edit("advisor", "Enter the new advisor ID.")}><Icon icon={guild.advisor ? "edit" : "add"} /></button>
            {#if guild.advisor}
                <button class="row tp red-text" on:click={removeAdvisor}><Icon icon="delete" /></button>
            {/if}
        </div>
        <b>Voter</b>
        {guild.delegated ? "Council Advisor" : "Server Owner"}
        <div class="row gap-1">
            <button class="tp text-accent" on:click={toggleDelegated}><Icon icon="switch_account" /></button>
        </div>
    </div>
    <br />
    <h3 class="short">Users</h3>
    <div class="contents">
        {#each Object.entries(guild.users) as [id, { staff, roles }]}
            {#if staff || roles.length > 0}
                <div>
                    <A to="/admin/api-manager/users/{id}">Edit</A>
                    {#if guild.owner !== id && guild.advisor !== id}
                        &mdash; <A on:click={() => setStaff(id, !staff)}>{staff ? "Remove" : "Add"} As Staff</A>
                    {/if}
                </div>
                <div>
                    <Mention {id}><UserId {id} bind:tag={tags[id]} /></Mention>
                </div>
                <div class="row gap-1">
                    {#if staff}<Badge icon="verified_user">Network Staff</Badge>{/if}
                    {#each roles as role}
                        <button class="void" on:click={() => deleteRole(role, id)}><Badge icon="clear">{role}</Badge></button>
                    {/each}
                    <button class="void" on:click={() => addRole(id)}><Badge class="text-accent" color="transparent" icon="add">Add Role</Badge></button>
                </div>
            {/if}
        {/each}
    </div>
    <br />
    <div class="row gap-1">
        <button class="row" on:click={addStaff}><Icon icon="add" /> Add Staff Member</button>
        <button class="row" on:click={addRoleToNewUser}><Icon icon="add" /> Add Role To New User</button>
    </div>
</Loading>

<style lang="scss">
    .contents {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 10px 25px;
    }
</style>
