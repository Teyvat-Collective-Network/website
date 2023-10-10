<script lang="ts">
    import Mention from "./Mention.svelte";
    import UserId from "./UserId.svelte";

    export let id: string;
    export let tag: string | null = null;
</script>

<Mention type={id === "1".repeat(18) ? "system" : "user"} {id}><UserId {id} bind:tag /></Mention>
