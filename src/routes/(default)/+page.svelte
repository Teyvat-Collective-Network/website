<script lang="ts">
    import { PUBLIC_COOKIE_DOMAIN } from "$env/static/public";
    import { dark_mode, user } from "$lib/stores";
</script>

<button
    on:click={() => {
        document.cookie = `mode=${$dark_mode ? "light" : "dark"};max-age=31536000;samesite=lax;domain=${PUBLIC_COOKIE_DOMAIN};path=/`;
        dark_mode.update((x) => !x);
    }}>switch to {$dark_mode ? "light" : "dark"} mode</button
>

{#if !$user}
    <a href="/login">log in</a>
{:else}
    <pre>{JSON.stringify($user)}</pre>
{/if}
