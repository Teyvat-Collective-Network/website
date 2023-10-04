<script lang="ts">
    import { PUBLIC_HUB } from "$env/static/public";
    import A from "./A.svelte";
    import Mention from "./Mention.svelte";

    export let id: string;
    export let guildNames: Record<string, string> = {};
    export let name: string | null = null;
</script>

<A to="/guilds/{id}" external><Mention type="guild">{name ?? guildNames[id] ?? (id === PUBLIC_HUB ? "TCN Hub" : id)}</Mention></A>
