<script lang="ts">
    import Mention from "./Mention.svelte";
    import UserId from "./UserId.svelte";

    export let id: string;
</script>

<Mention {id}><UserId {id} /></Mention>
