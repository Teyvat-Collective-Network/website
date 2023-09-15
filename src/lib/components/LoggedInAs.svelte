<script lang="ts">
    import { user } from "$lib/stores";
    import A from "./A.svelte";
    import Mention from "./Mention.svelte";
</script>

<div class="panel highlight">
    <p class="row gap-1">
        <span>Logged in as <Mention>{$user?.tag}</Mention>. Your user ID will be submitted with this form. Not you?</span>
        <A on:click={() => fetch(`/logout`, { method: "post" }).then(() => location.reload())}>Log Out</A>
    </p>
</div>
