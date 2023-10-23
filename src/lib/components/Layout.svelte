<script lang="ts" context="module">
    declare const MathJax: any;
</script>

<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import Menu from "$lib/components/Menu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { select } from "$lib/html-utils";
    import { alerts, auditMessage, auditReason, auditRequired, darkMode, modals } from "$lib/stores";
    import { onMount } from "svelte";
    import Alert from "./Alert.svelte";
    import ConfirmCancel from "./ConfirmCancel.svelte";
    import FixedButton from "./FixedButton.svelte";
    import Modal from "./Modal.svelte";
    import Show from "./Show.svelte";

    const { copy, save, nodelete, nomore, sent, edited } = alerts;
    const { audit } = modals;

    let scroll: number = 0;
    let show = false;

    onMount(() => {
        show = true;

        setTimeout(() => {
            const { hash } = new URL(location.href);

            if (hash)
                scrollTo({
                    top: select(hash).getBoundingClientRect().top - select("body").getBoundingClientRect().top - window.innerHeight / 2,
                    behavior: "instant",
                });
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

    let reason: string = "";
    $: trimmedReason = reason?.trim() ?? "";

    let auditInput: Element & { focus: any };

    auditReason.subscribe((x) => (reason = x as any));
    audit.subscribe((x) => x && auditInput.focus());

    let first = false;
    onMount(() => setTimeout(() => (first = true), 250));
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
        <link rel="stylesheet" type="text/css" href="/styles/{$darkMode ? 'dark' : 'light'}.css" />
        <link rel="stylesheet" type="text/css" href="/styles/main.css" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

        <title>TCN</title>
    </head>

    <body>
        <FixedButton icon="expand_less" click={() => scrollTo({ top: 0 })} />
        <Show when={show}>
            <Menu />
            <Navbar />
            <div id="slot">
                <slot />
            </div>
        </Show>
    </body>
</html>

<Alert icon="content_copy" iconColor="rgb(var(--blue-text))" text="Copied to clipboard" open={$copy > 0} />
<Alert icon="check" iconColor="rgb(var(--green-text))" text="Saved" open={$save > 0} />
<Alert icon="clear" iconColor="rgb(var(--red-text))" text="That item cannot be deleted." open={$nodelete > 0} />
<Alert icon="block" iconColor="rgb(var(--red-text))" text="No more items to load." open={$nomore > 0} />
<Alert icon="send" iconColor="rgb(var(--green-text))" text="Sent" open={$sent > 0} />
<Alert icon="send" iconColor="rgb(var(--green-text))" text="Edited" open={$edited > 0} />

{#if first}
    <Modal bind:open={$audit} on:close={() => auditReason.set(null)} confirmClose={!!trimmedReason}>
        <h3 class="short">Audit Log Reason</h3>
        <p>{$auditMessage}</p>
        <p class="text-2">This action will be logged. Enter a reason below.</p>
        <p><input bind:this={auditInput} type="text" class="bg-1" placeholder={$auditRequired ? "" : "Optional."} bind:value={reason} /></p>
        <ConfirmCancel
            save={$audit}
            bind:cancel={$audit}
            canceled={() => auditReason.set(null)}
            valid={trimmedReason || !$auditRequired}
            confirm={() => auditReason.set(trimmedReason)}
        />
    </Modal>
{/if}

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
</style>
