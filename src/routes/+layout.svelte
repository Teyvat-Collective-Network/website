<script lang="ts">
    import { page } from "$app/stores";
    import { darkMode, token, user } from "$lib/stores";

    token.set($page.data.token);
    user.set($page.data.user);
    darkMode.set($page.data.darkMode);
</script>

<slot />
