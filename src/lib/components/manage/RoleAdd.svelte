<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import DiscordRole from "../DiscordRole.svelte";

    export let array: string[];
    export let roles: Record<string, { name: string; color: number; manageable: boolean }>;
    export let manageableOnly: boolean = false;

    const dispatch = createEventDispatcher();
</script>

<span class="row gap-1">
    {#each Object.entries(roles).filter(([x]) => !array.includes(x)) as [id, { name, color, manageable }]}
        {#if manageable || !manageableOnly}
            <button class="void" on:click={() => ((array = [...array, id]), dispatch("add", id))}>
                <DiscordRole icon="add" {id} {name} {color} />
            </button>
        {/if}
    {/each}
</span>
