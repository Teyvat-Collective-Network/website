<script lang="ts">
    import { page } from "$app/stores";
    import { selectall } from "$lib/html-utils";
    import { council, dark_mode, observer, user } from "$lib/stores";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    let open = false;
    let href: string;

    const close = () => (open = false);

    let doc: Document | null = null;

    onMount(() => {
        selectall<HTMLAnchorElement>("#contents > a").forEach((e) => (e.onclick = () => setTimeout(close)));

        page.subscribe((x) => {
            href = x.url.href;
            selectall<HTMLAnchorElement>("#contents > a").forEach((e) => (e.style.backgroundColor = e.href === href ? "#00000022" : ""));
        });

        doc = document;
    });

    let index = 0;
    $: open && (index = selectall<HTMLAnchorElement | HTMLButtonElement>("#contents > a, #contents > button").findIndex((e) => "href" in e && e.href === href));
    $: selectall<HTMLAnchorElement | HTMLButtonElement>("#contents > a:not(.hidden), #contents > button:not(.hidden)")?.[index]?.focus();

    let info_open = false;
    let staff_open = true;
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.ctrlKey && e.key === "k") {
            e.preventDefault();
            open = !open;
        } else if (e.key === "Escape") {
            open = false;
        } else if (open && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();

            const { length } = selectall("#contents > a:not(.hidden)");

            if (e.key === "ArrowUp") index = (index + length - 1) % length;
            else index = (index + 1) % length;
        }
    }}
/>

<svg role="none" viewBox="0 0 100 100" class={open ? "open" : ""} on:click={() => (open = !open)}>
    <rect id="top" x="10" y="10" width="80" height="10" />
    <rect id="mid" x="10" y="45" width="80" height="10" />
    <rect id="bot" x="10" y="80" width="80" height="10" />
</svg>

<div id="bar" class="bg-0" />
<div id="spacer" />

<div id="sidebar" class={open ? "open" : ""}>
    <div id="contents">
        <button
            class="t1"
            on:click={() => {
                dark_mode.update((x) => !x);
            }}
        >
            <Icon icon={$dark_mode ? "light_mode" : "dark_mode"} />
            Switch to {$dark_mode ? "Light" : "Dark"} Mode
        </button>

        <a href="/" class="t1">Home Page</a>
        <a href="/about" class="t1">About Us</a>
        <a href="/partners" class="t1">Partners</a>

        {#if $user}
            {#if Object.keys($user.guilds).length > 0}
                <a href="/">To-Do</a>
            {/if}

            <button class="t1" on:click={() => fetch(`/logout`, { method: "post" }).then(() => location.reload())}>
                Log Out
                <Icon icon="logout" />
            </button>
        {:else}
            <a href="/login" class="t1">Log In <Icon icon="login" /></a>
        {/if}
    </div>
    <div id="footer">
        {#if $user}
            <span class="text-2">Logged in as <span class="mention with-icon"><Icon icon="alternate_email" /> {$user.tag}</span></span>
            <br />
            {#if $observer || $council}
                <span class="text-2" style="border-left: 5px solid rgb(var(--accent)); padding-left: 1em">
                    {#if $observer}
                        You are a TCN observer.
                    {:else}
                        You are on the TCN council.
                    {/if}
                </span>
                <br />
            {/if}
        {/if}
        &copy; 2023 TCN Development Team
    </div>
</div>

<div role="none" id="backdrop" class={open ? "open" : ""} on:click={close} on:keydown={close} />

<style lang="scss">
    #bar,
    #spacer {
        height: 80px;
        left: 0;
        right: 0;
        top: 0;

        @media screen and (min-width: 1360px) {
            display: none;
        }
    }

    #bar {
        position: fixed;
        z-index: 10;
    }

    svg {
        cursor: pointer;
        height: 32px;
        outline: none;
        padding: 24px;
        position: fixed;
        width: 32px;
        z-index: 11;
    }

    rect {
        fill: rgb(var(--accent-more));
        transition: transform 250ms cubic-bezier(0, 1, 0.6, 1.4), opacity 250ms cubic-bezier(0, 1, 0.6, 1.4);
    }

    #top {
        transform-origin: 15% 15%;
    }

    #mid {
        transform-origin: 50% 50%;
    }

    #bot {
        transform-origin: 15% 85%;
    }

    .open {
        #bot {
            transform: rotateZ(-45deg) scaleX(1.414);
        }

        #mid {
            opacity: 0;
            transform: translateX(-50%);
        }

        #top {
            transform: rotateZ(45deg) scaleX(1.414);
        }
    }

    #sidebar {
        background-color: rgb(var(--bg-1));
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        position: fixed;
        transition: transform 250ms, opacity 250ms;
        width: 25%;
        z-index: 5;

        @media screen and (max-width: 1000px) {
            width: 75%;
        }

        &:not(.open) {
            opacity: 0%;
            pointer-events: none;
            transform: translateX(-100%);
        }

        &.open {
            opacity: 100%;
            transform: translateX(0);
        }
    }

    #backdrop {
        backdrop-filter: blur(2px);
        background-color: rgb(var(--pure-rgb), 40%);
        height: 100%;
        position: fixed;
        transition: opacity 250ms;
        width: 100%;
        z-index: 4;

        &:not(.open) {
            opacity: 0%;
            pointer-events: none;
        }

        &.open {
            opacity: 100%;
        }
    }

    #contents {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        padding-top: 92px;
    }

    #footer {
        font-weight: 400;
        padding: 1em;
    }

    .t1 {
        font-weight: 600;
        padding-left: 1em;
    }

    .t2 {
        font-weight: 400;
        padding-left: 2em;
    }

    .t3 {
        font-weight: 300;
        padding-left: 3em;
    }

    a,
    button {
        align-items: center;
        background-color: transparent;
        border: none;
        color: rgb(var(--text-accent));
        display: flex;
        flex-direction: row;
        font-family: "Rubik", sans-serif;
        font-size: 90%;
        gap: 0.5em;
        outline: none;
        text-decoration: none;
    }

    button {
        padding: 5px 0;
    }

    a:hover,
    a:focus,
    button:hover,
    button:focus {
        background-color: #00000011;
    }

    a.hidden {
        display: none;
    }
</style>
