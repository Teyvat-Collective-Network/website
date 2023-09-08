<script lang="ts">
    import { page } from "$app/stores";
</script>

<head>
    <link rel="stylesheet" type="text/css" href="/styles/{$page.data.dark ? 'dark' : 'light'}.css" />
    <link rel="stylesheet" type="text/css" href="/styles/classes.css" />
    <link rel="stylesheet" type="text/css" href="/styles/main.css" />
</head>

<slot />
