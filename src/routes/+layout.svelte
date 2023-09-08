<script lang="ts">
    import { page } from "$app/stores";
    import { dark_mode, token, user } from "$lib/stores";

    token.set($page.data.token);
    user.set($page.data.user);
    dark_mode.set($page.data.dark_mode);
</script>

<head>
    <link rel="stylesheet" type="text/css" href="/styles/{$dark_mode ? 'dark' : 'light'}.css" />
    <link rel="stylesheet" type="text/css" href="/styles/classes.css" />
    <link rel="stylesheet" type="text/css" href="/styles/main.css" />
</head>

<slot />
