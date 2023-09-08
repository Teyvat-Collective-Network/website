<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import Menu from "$lib/components/Menu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { dark_mode } from "$lib/stores";
</script>

<html lang="en" class="bg-1 text-1">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Teyvat Collective Network" />
        <meta name="keywords" content="teyvat, collective, network, tcn, genshin, impact" />
        <meta name="author" content="Teyvat Collective Network Development Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:title" content="Teyvat Collective Network" />
        <meta
            property="og:description"
            content="The Teyvat Collective Network is a network of high-quality Genshin Impact Discord servers, each dedicated to one character. Our mission is to unite mains servers across Teyvat, provide support, and promote collaboration."
        />
        <meta property="og:url" content={PUBLIC_DOMAIN} />
        <meta property="og:image" content="{PUBLIC_DOMAIN}/favicon.png" />
        <meta name="theme-color" data-react-hemlet="true" content="#2078668" />

        <link rel="shortcut icon" type="image/png" href="/favicon.png" />

        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" type="text/css" href="/styles/{$dark_mode ? 'dark' : 'light'}.css" />
        <link rel="stylesheet" type="text/css" href="/styles/main.css" />

        <title>TCN</title>
    </head>

    <body>
        <Menu />
        <Navbar />
        <div id="slot">
            <slot />
        </div>
    </body>
</html>

<style lang="scss">
    #slot {
        margin-bottom: 2em;
    }
</style>
