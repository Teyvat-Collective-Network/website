<script lang="ts">
    import { PUBLIC_HQ, PUBLIC_HUB } from "$env/static/public";
    import A from "./A.svelte";
    import Mention from "./Mention.svelte";

    export let id: string;
    export let guildNames: Record<string, string> = {};
    export let name: string | null = null;
    export let openInTab: boolean = false;
</script>

<A to="/server/{id}" external={!openInTab}>
    <Mention type="guild">{name ?? guildNames[id] ?? (id === PUBLIC_HQ ? "TCN HQ" : id === PUBLIC_HUB ? "TCN Hub" : id)}</Mention>
</A>
