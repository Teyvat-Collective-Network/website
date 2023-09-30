<script lang="ts">
    import { page } from "$app/stores";
    import { dark_mode, token, user } from "$lib/stores";
    import { onMount } from "svelte";

    token.set($page.data.token);
    user.set($page.data.user);
    dark_mode.set($page.data.dark_mode);
</script>

<slot />
