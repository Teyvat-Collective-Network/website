<script lang="ts">
    import { page } from "$app/stores";
    import { user } from "$lib/stores";
    import A from "./A.svelte";
    import Mention from "./Mention.svelte";

    export let message: string = "Your user ID will be submitted with this form.";
</script>

<div class="panel highlight">
    <p class="row gap-1">
        <span>
            {#if $user}
                Logged in as <Mention>{$user?.tag}</Mention>. {message} Not you?
                <A on:click={() => fetch(`/logout`, { method: "post" }).then(() => location.reload())}>Log Out</A>
            {:else}
                You are not signed in. <A to="/login?redirect={$page.url.pathname}">Log In</A>
            {/if}
        </span>
    </p>
</div>
