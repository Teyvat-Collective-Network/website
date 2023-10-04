<script lang="ts">
    export let changes: Record<string, [any, any]>;
    export let names: Record<string, string> = {};
    export let code: string[] = [];
    export let show: string[] | null = null;
    export let hide: string[] = [];
    export let codeAll: boolean = false;
</script>

{#each Object.entries(changes) as [key, [before, after]]}
    {#if (!show || show.includes(key)) && !hide.includes(key)}
        <li>
            <b>{names[key] ?? (key === "id" ? "ID" : `${key.charAt(0).toUpperCase()}${key.slice(1)}`)}:</b>
            {#if codeAll || code.includes(key)}
                <code>{before}</code> &rightarrow; <code>{after}</code>
            {:else}
                {#if before != null}{before}{:else}<span class="text-2">(none)</span>{/if} &rightarrow;
                {#if after != null}{after}{:else}<span class="text-2">(none)</span>{/if}
            {/if}
        </li>
    {/if}
{/each}
