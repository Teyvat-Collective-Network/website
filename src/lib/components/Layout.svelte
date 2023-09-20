<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import Menu from "$lib/components/Menu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { select } from "$lib/html-utils";
    import { dark_mode } from "$lib/stores";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";
    import Show from "./Show.svelte";

    let scroll: number = 0;
    let show = false;
    let opaque = false;

    onMount(() => {
        show = true;

        setTimeout(() => {
            const { hash } = new URL(location.href);

            if (hash)
                scrollTo({
                    top: select(hash).getBoundingClientRect().top - select("body").getBoundingClientRect().top - window.innerHeight / 2,
                    behavior: "instant",
                });

            opaque = true;
        }, 100);
    });
</script>

<svelte:window bind:scrollY={scroll} />

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

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" type="text/css" href="/styles/{$dark_mode ? 'dark' : 'light'}.css" />
        <link rel="stylesheet" type="text/css" href="/styles/main.css" />

        <title>TCN</title>
    </head>

    <body>
        <button id="top" on:click={() => scrollTo({ top: 0 })} style="opacity: {scroll ? 1 : 0}">
            <Icon icon="expand_less" />
        </button>
        <Show when={show}>
            <Menu />
            <Navbar />
            <div id="slot">
                <slot />
            </div>
        </Show>
    </body>
</html>

<style lang="scss">
    @keyframes fade-in {
        0% {
            opacity: 0;
            transform: translateX(-0.5vw);
        }

        100% {
        }
    }

    body {
        animation: 0s 100ms fade-in backwards;
    }

    #slot {
        margin-bottom: 2em;
    }

    :global(#slot > *) {
        animation: 600ms 100ms fade-in backwards;
    }

    #top {
        aspect-ratio: 1 / 1;
        background-color: rgb(var(--text-accent));
        border-radius: 50%;
        border: none;
        bottom: 50px;
        box-shadow: 2px 2px 10px rgb(var(--pure-rgb), 75%);
        color: rgb(var(--pure-rgb));
        outline: none;
        padding: 10px;
        position: fixed;
        right: 50px;
        transition: transform 50ms, box-shadow 50ms, opacity 200ms;
        z-index: 1;

        &:active {
            box-shadow: 2px 2px 10px transparent;
            transform: translate(2px, 2px);
        }
    }
</style>
