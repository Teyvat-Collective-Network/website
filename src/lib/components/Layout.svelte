<script lang="ts" context="module">
    declare const MathJax: any;
</script>

<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import Menu from "$lib/components/Menu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { select } from "$lib/html-utils";
    import { alerts, dark_mode } from "$lib/stores";
    import { onMount } from "svelte";
    import Alert from "./Alert.svelte";
    import Icon from "./Icon.svelte";
    import Show from "./Show.svelte";

    const { copy, save } = alerts;

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

        MathJax.typeset();
    });

    export let title: string = "Teyvat Collective Network";
    export let description: string =
        "The Teyvat Collective Network is a network of high-quality Genshin Impact Discord servers, each dedicated to one character. Our mission is to unite mains servers across Teyvat, provide support, and promote collaboration.";
    export let color: number = 0x207868;
    export let image: string = `${PUBLIC_DOMAIN}/favicon.png`;
    export let thumbnail: boolean = true;

    function click({ target }: MouseEvent) {
        if (target instanceof Element && target.tagName === "SPAN" && target.classList.contains("mention") && "dataset" in target) {
            const { id } = target.dataset as { id?: string };

            if (id) {
                navigator.clipboard.writeText(id);
                copy.update((x) => x + 1);
                setTimeout(() => copy.update((x) => x - 1), 1500);
            }
        }
    }
</script>

<svelte:window bind:scrollY={scroll} on:click={click} />

<html lang="en" class="bg-1 text-1">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Teyvat Collective Network" />
        <meta name="keywords" content="teyvat, collective, network, tcn, genshin, impact" />
        <meta name="author" content="Teyvat Collective Network Development Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={PUBLIC_DOMAIN} />
        <meta property="og:image" content={image} />
        {#if !thumbnail}<meta name="twitter:card" content="summary_large_image" />{/if}
        <meta name="theme-color" data-react-helmet="true" content="#{color.toString(16).padStart(6, '0')}" />

        <link rel="shortcut icon" type="image/png" href="/favicon.png" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" type="text/css" href="/styles/{$dark_mode ? 'dark' : 'light'}.css" />
        <link rel="stylesheet" type="text/css" href="/styles/main.css" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

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

<Alert icon="content_copy" text="Copied to clipboard" open={$copy > 0} />
<Alert icon="check" text="Saved" open={$save > 0} />

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
