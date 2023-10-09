<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import DiscordRole from "$lib/components/DiscordRole.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Show from "$lib/components/Show.svelte";
    import RoleAdd from "$lib/components/manage/RoleAdd.svelte";
    import { alerts, token } from "$lib/stores";
    import type { Guild, Rolesync } from "$lib/types";
    import { onMount } from "svelte";

    const { id } = $page.params;
    const { save } = alerts;

    const roles = $page.data.roles as Record<string, { name: string; color: number; manageable: boolean }>;

    let guild: Guild;
    let rolesync: Rolesync;

    onMount(async () => {
        guild = await api($token, `GET /guilds/${id}`).catch(alert);
        rolesync = await api($token, `GET /guilds/${id}/rolesync`).catch(alert);
    });

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

    function addApiToRole() {
        const role = prompt("Enter the API role for which to add synchronizations.");
        if (!role) return;
        if (rolesync.apiToRole[role]) return alert("That API role is already on the list.");

        rolesync.apiToRole[role] = [];
    }
</script>

<h1>
    Manage {#if guild}{guild.name}{:else}<span class="text-2">{id}</span>{/if}
</h1>
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
                {#each keys as key, index}
                    {@const array = rolesync[key]}
                    {@const openKey = `addrole-first-${index}`}
                    <h5 class="short row gap-1 sub-header">{index === 0 ? "Role" : "Staff"} <Icon icon="trending_flat" /> {index === 0 ? "Staff" : "Role"}</h5>
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
                <h5 class="short row gap-1 sub-header">API <Icon icon="trending_flat" /> Role</h5>
                <p class="text-2">
                    For each API role below, users with that role (either globally or within this guild) will automatically be assigned the Discord roles listed
                    following it. Only roles that the bot can manage can be added.
                </p>
                <div class="col no-center gap-1">
                    {#each Object.entries(rolesync.apiToRole) as [apiRole, roleList]}
                        {@const openKey = `addrole-apitorole-${apiRole}`}
                        <div class="row gap-1">
                            <A
                                class="row red-text"
                                on:click={() => (rolesync.apiToRole = Object.fromEntries(Object.entries(rolesync.apiToRole).filter(([x]) => x !== apiRole)))}
                            >
                                <Icon icon="delete" />
                            </A>
                            <span><code>{apiRole}</code></span>
                            <Icon icon="trending_flat" />
                            {#each roleList as role}
                                <button class="void" on:click={() => (rolesync.apiToRole[apiRole] = rolesync.apiToRole[apiRole].filter((x) => x !== role))}>
                                    <DiscordRole icon="clear" id={role} name={roles[role]?.name} color={roles[role]?.color ?? 0} />
                                </button>
                            {/each}
                            <button on:click={() => (open[openKey] = !open[openKey])}>
                                <Icon icon={open[openKey] ? "keyboard_double_arrow_left" : "add"} />
                            </button>
                            {#if open[openKey]}
                                <RoleAdd manageableOnly bind:array={rolesync.apiToRole[apiRole]} {roles} />
                            {/if}
                        </div>
                    {/each}
                    <A on:click={addApiToRole}>add API role</A>
                </div>
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
