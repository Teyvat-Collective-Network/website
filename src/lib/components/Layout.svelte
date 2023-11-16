<script lang="ts" context="module">
    import type { SecretSantaUser } from "$lib/types";
    declare const MathJax: any;

    const messages: Record<Exclude<SecretSantaUser["status"], undefined>, string> = {
        none: "You've saved your Secret Santa info but haven't locked in yet! Head over to the form to continue the sign-up flow.",
        "locked-out":
            "You've been temporarily locked out of participating in Secret Santa, but don't worry. You'll be able to sign up again 24 hours after you last forfeited your entry. If you already gave a gift to your original receiver, please fill out the form as soon as possible.",
        "locked-sender": "You're locked in! Make sure you watch your remaining time and give your gift and submit the form in time!",
        "awaiting-approval": "Your gift proof has been received! Please give us some time to review it and approve it.",
        "pool-free": "Your proof has been approved! You'll receive a gift soon!",
        "pool-locked": "Your proof has been approved! You'll receive a gift soon!",
        limbo: "Our records show that you've received a gift, but we haven't approved the proof yet. If you did not receive a gift, please <tcn-link to='/contact'>reach out</tcn-link> to us as soon as possible.",
        done: "Thank you for participating in our Secret Santa event! We've approved the proof for the user who gave you your gift, so if you didn't receive anything, please <tcn-link to='/contact'>let us know</tcn-link> as soon as possible so we can fix it.",
        banned: "You have been <b>banned</b> from participating in the Secret Santa event (this happens if we determined your proof was illegitimate). If you believe that this was a mistake, please <tcn-link to='/contact'>let us know</tcn-link>.",
    };
</script>

<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import api from "$lib/api";
    import Menu from "$lib/components/Menu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { select } from "$lib/html-utils";
    import { blockApproval } from "$lib/secret-santa";
    import { alerts, auditMessage, auditReason, auditRequired, darkMode, modals, token } from "$lib/stores";
    import { onMount } from "svelte";
    import A from "./A.svelte";
    import Alert from "./Alert.svelte";
    import Callout from "./Callout.svelte";
    import ConfirmCancel from "./ConfirmCancel.svelte";
    import Div from "./Div.svelte";
    import FixedButton from "./FixedButton.svelte";
    import Modal from "./Modal.svelte";
    import OneTimeMessage from "./OneTimeMessage.svelte";
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
    export let hideSecretSantaMessage: boolean = false;

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

    let dismiss: any;
    let dismissReminder: any;

    let secretSantaUser: SecretSantaUser | undefined;

    onMount(async () => {
        secretSantaUser = await api($token, `GET /secret-santa/data`).catch(() => {});
    });
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
                {#if !hideSecretSantaMessage}
                    {#if secretSantaUser && (secretSantaUser.status !== "none" || secretSantaUser.info)}
                        <svelte:component
                            this={secretSantaUser.status === "done" || secretSantaUser.status === "banned" ? OneTimeMessage : Div}
                            id="secret-santa-reminder"
                            bind:dismiss={dismissReminder}
                        >
                            <div class="container">
                                <Callout style="info">
                                    <p>{@html messages[secretSantaUser.status ?? "none"]}</p>
                                    <div class="row gap-1">
                                        <A to="/secret-santa/form">Go to form</A>
                                        {#if secretSantaUser.status === "limbo"}
                                            <button on:click={() => blockApproval($token)}>Block Approval</button>
                                        {/if}
                                        <button on:click={() => ((secretSantaUser = undefined), dismissReminder())}>Close</button>
                                    </div>
                                </Callout>
                                <br />
                            </div>
                        </svelte:component>
                    {:else}
                        <OneTimeMessage id="secret-santa-banner-ad" bind:dismiss>
                            <div class="container">
                                <Callout style="info">
                                    <p>Hey! Interested in our network-side Secret Santa event? Check it out <A to="/secret-santa">here</A>!</p>
                                    <p><button on:click={dismiss}>Dismiss</button></p>
                                </Callout>
                                <br />
                            </div>
                        </OneTimeMessage>
                    {/if}
                {/if}
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
