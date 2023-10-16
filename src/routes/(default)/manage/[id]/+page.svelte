<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_HQ, PUBLIC_HUB } from "$env/static/public";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import DiscordRole from "$lib/components/DiscordRole.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Show from "$lib/components/Show.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import ApiToRole from "$lib/components/manage/ApiToRole.svelte";
    import RoleAdd from "$lib/components/manage/RoleAdd.svelte";
    import { alerts, token } from "$lib/stores";
    import type { Guild, Rolesync } from "$lib/types";
    import { without } from "$lib/utils";
    import { onMount } from "svelte";

    const { id } = $page.params;
    const { save } = alerts;

    const roles = $page.data.roles as Record<string, { name: string; color: number; manageable: boolean }>;

    let guild: Guild;
    let guilds: Guild[];
    let rolesync: Rolesync;
    let autosync: { template: string };

    onMount(async () => {
        if (id === PUBLIC_HQ || id === PUBLIC_HUB)
            guild = {
                id,
                owner: "",
                advisor: null,
                voter: "",
                delegated: true,
                name: id === PUBLIC_HQ ? "TCN HQ" : "TCN Hub",
                invite: "",
                users: {},
                mascot: "",
            };
        else guild = await api($token, `GET /guilds/${id}`).catch(alert);

        guilds = await api($token, `GET /guilds`).catch(alert);
        rolesync = await api($token, `GET /guilds/${id}/rolesync`).catch(alert);
        autosync = await api($token, `GET /autosync/${id}`).catch(alert);
    });

    async function saveAutosync() {
        try {
            await api($token, `PATCH /autosync/${id}`, { template: autosync.template });
            save.update((x) => x + 1);
            setTimeout(() => save.update((x) => x - 1), 1500);
        } catch (error) {
            alert(error);
        }
    }

    const open: Record<string, boolean> = { rolesync: true };

    async function saveRolesync() {
        try {
            await api($token, `PUT /guilds/${id}/rolesync`, rolesync);
            save.update((x) => x + 1);
            setTimeout(() => save.update((x) => x - 1), 1500);
        } catch (error) {
            alert(error);
        }
    }

    const keys = ["roleToStaff", "staffToRole"] as const;

    function addApiRole(role: string) {
        const add = prompt(`Enter the role you want to add to the list of API roles to apply to users with the "${roles[role]?.name}" Discord role.`);
        if (!add) return;
        if (!add.match(/^[a-z-]{1,32}$/)) return alert("That does not match the valid format for an API role (1-32 characters, lowercase letters and dashes).");
        if (rolesync.roleToApi[role].includes(add)) return alert("That API role is already on the list.");

        rolesync.roleToApi[role] = [...rolesync.roleToApi[role], add];
    }
</script>

<h1>
    Manage {#if guild}{guild.name}{:else}<span class="text-2">{id}</span>{/if}
</h1>
<div class="panel">
    <h3 class="short category-header">Autosync <Expand bind:open={open.autosync} /></h3>
    <Show when={open.autosync}>
        {#if Object.keys(roles).length === 0}
            <Callout style="red">
                <p>Please <A to="/add-bot" external>add the bot</A> to this server to use autosync.</p>
            </Callout>
        {:else}
            <Loading done={autosync}>
                <Textarea class="bg-1" bind:value={autosync.template} rows={32} />
                <button class="row" on:click={saveAutosync}><Icon icon="save" /> Save</button>
            </Loading>
        {/if}
    </Show>
</div>
<div class="panel">
    <h3 class="short category-header">Rolesync <Expand bind:open={open.rolesync} /></h3>
    <Show when={open.rolesync}>
        {#if Object.keys(roles).length === 0}
            <Callout style="red">
                <p>
                    Please <A to="/add-bot" external>add the bot</A> to this server to use rolesync.
                </p>
            </Callout>
        {:else}
            <Loading done={rolesync}>
                {#if id !== PUBLIC_HQ && id !== PUBLIC_HUB}
                    {#each keys as key, index}
                        {@const array = rolesync[key]}
                        {@const openKey = `addrole-first-${index}`}
                        <h5 class="short row gap-1 sub-header">
                            {index === 0 ? "Role" : "Staff"}
                            <Icon icon="trending_flat" />
                            {index === 0 ? "Staff" : "Role"}
                        </h5>
                        <p class="text-2">
                            {index === 0
                                ? "Users with any of these roles will automatically be assigned as staff."
                                : "Staff will automatically be assigned all of these roles. Only roles that the bot can manage can be added."}
                        </p>
                        <div class="col no-center gap-1">
                            {#each array as role}
                                <div class="row gap-1">
                                    <A class="row red-text" on:click={() => (rolesync[key] = array.filter((x) => x !== role))}><Icon icon="delete" /></A>
                                    <DiscordRole id={role} name={roles[role]?.name} color={roles[role]?.color ?? 0} />
                                </div>
                            {/each}
                            <span class="row gap-1">
                                <A on:click={() => (open[openKey] = !open[openKey])}>{open[openKey] ? "collapse" : "add roles"}</A>
                                {#if open[openKey]}
                                    <RoleAdd manageableOnly={index === 1} bind:array={rolesync[key]} {roles} />
                                {/if}
                            </span>
                        </div>
                    {/each}
                    <h5 class="short row gap-1 sub-header">Role <Icon icon="trending_flat" /> API</h5>
                    <p class="text-2">For each Discord role below, users with that role will automatically be assigned the API roles listed following it.</p>
                    <div class="col no-center gap-1">
                        {#each Object.entries(rolesync.roleToApi) as [role, apiRoles]}
                            <div class="row gap-1">
                                <A
                                    class="row red-text"
                                    on:click={() => (rolesync.roleToApi = Object.fromEntries(Object.entries(rolesync.roleToApi).filter(([x]) => x !== role)))}
                                >
                                    <Icon icon="delete" />
                                </A>
                                <DiscordRole id={role} name={roles[role]?.name} color={roles[role]?.color ?? 0} />
                                <Icon icon="trending_flat" />
                                {#each apiRoles as apiRole}
                                    <button
                                        class="void row"
                                        on:click={() => (rolesync.roleToApi[role] = apiRoles.filter((x) => x !== apiRole))}
                                        style="padding: 0 5px; outline: 2px solid rgb(var(--red-text))"
                                    >
                                        <Icon icon="clear" />
                                        {apiRole}
                                    </button>
                                {/each}
                                <button on:click={() => addApiRole(role)}><Icon icon="add" /></button>
                            </div>
                        {/each}
                        <span class="row gap-1">
                            <A on:click={() => (open.addRoleToApi = !open.addRoleToApi)}>{open.addRoleToApi ? "collapse" : "add roles"}</A>
                            {#if open.addRoleToApi}
                                <RoleAdd array={Object.keys(rolesync.roleToApi)} {roles} on:add={({ detail }) => (rolesync.roleToApi[detail] = [])} />
                            {/if}
                        </span>
                    </div>
                {/if}
                <h5 class="short row gap-1 sub-header">API <Icon icon="trending_flat" /> Role</h5>
                <p class="text-2">
                    For each API condition below, users matching the condition will automatically be assigned the Discord roles listed following it. Only roles
                    that the bot can manage can be added.
                </p>
                <div class="col no-center gap-1">
                    {#each rolesync.apiToRole as entry, index}
                        <ApiToRole bind:entry {guilds}>
                            <A class="red-text" on:click={() => (rolesync.apiToRole = without(rolesync.apiToRole, index))}>delete condition</A>
                        </ApiToRole>
                    {/each}
                    <A on:click={() => (rolesync.apiToRole = [...rolesync.apiToRole, { type: "position", value: "observer", roles: [] }])}>add API condition</A>
                </div>
                <br />
                <button class="row" on:click={saveRolesync}><Icon icon="save" /> Save</button>
            </Loading>
        {/if}
    </Show>
</div>

<style lang="scss">
    .category-header {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .sub-header {
        border-bottom: 2px solid rgb(var(--text-3));
    }
</style>
