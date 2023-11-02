<script lang="ts">
    import { page } from "$app/stores";
    import type { Guild, Rolesync } from "$lib/types";
    import A from "../A.svelte";
    import DiscordRole from "../DiscordRole.svelte";
    import Icon from "../Icon.svelte";
    import Show from "../Show.svelte";
    import RoleAdd from "./RoleAdd.svelte";

    export let entry: Rolesync["apiToRole"][0];
    export let guilds: Guild[];

    let open = false,
        rolesOpen = false;
    const roles = $page.data.roles as Record<string, { name: string; color: number; manageable: boolean }>;
</script>

<div class="panel col no-center gap-1 bg-2">
    <div class="row gap-1">
        <b>Bind to</b>
        <span>
            <select bind:value={entry.type} on:input={(e) => (entry.value = e.currentTarget.value === "position" ? "observer" : "")}>
                <option value="position">Position</option>
                <option value="role">Role</option>
            </select>
        </span>
        &mdash;
        <span>
            {#if entry.type === "position"}
                <select bind:value={entry.value}>
                    <option value="observer">Observer</option>
                    <option value="owner">Server Owner</option>
                    <option value="advisor">Council Advisor</option>
                    <option value="voter">Voter</option>
                    <option value="council">Council Member</option>
                    <option value="staff">Network Staff</option>
                </select>
            {:else}
                <input type="text" class="mono" bind:value={entry.value} />
            {/if}
        </span>
        <b>in guild</b>
        <span>
            {guilds.find((x) => x.id === entry.guild)?.name ?? "[network-wide]"}
        </span>
        <button class="tp text-accent" on:click={() => (open = !open)}><Icon icon={open ? "keyboard_arrow_down" : "edit"} /></button>
    </div>
    <Show when={open}>
        <div class="row gap-1">
            <button class="row {entry.guild ? 'tp text-accent' : ''}" on:click={() => (entry.guild = null)}>
                <Icon icon="clear" /> Network-Wide
            </button>
            {#each guilds as guild}
                <button class={guild.id === entry.guild ? "" : "tp text-accent"} on:click={() => (entry.guild = guild.id)}>
                    {guild.name}
                </button>
            {/each}
        </div>
    </Show>
    <b>When the above is met, give these roles:</b>
    {#each entry.roles as role}
        <div class="row gap-1">
            <A class="row red-text" on:click={() => (entry.roles = entry.roles.filter((x) => x !== role))}><Icon icon="delete" /></A>
            <DiscordRole id={role} name={roles[role]?.name} color={roles[role]?.color ?? 0} />
        </div>
    {/each}
    <div class="row gap-1">
        <A on:click={() => (rolesOpen = !rolesOpen)}>{rolesOpen ? "collapse" : "add roles"}</A>
        {#if rolesOpen}
            <RoleAdd manageableOnly bind:array={entry.roles} {roles} />
        {/if}
    </div>
    <slot />
</div>
