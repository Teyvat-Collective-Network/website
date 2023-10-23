<script lang="ts" context="module">
    function mapRoute(real: string): string {
        for (const prefix of ["/info/other-bots", "/info/discord", "/admin/api-manager", "/docs", "/manage"]) if (real.startsWith(prefix)) return prefix;
        return real;
    }
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import { selectall } from "$lib/html-utils";
    import { darkMode, token, user } from "$lib/stores";
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";
    import Mention from "./Mention.svelte";
    import Show from "./Show.svelte";
    import Timestamp from "./Timestamp.svelte";

    let open = false;
    let href: string;

    const close = () => (open = false);

    let doc: any = null;

    onMount(() => {
        selectall<HTMLAnchorElement>("#sidebar-contents a:not(.btn)").forEach((e) => (e.onclick = () => setTimeout(close)));

        page.subscribe((x) => {
            href = `${x.url.origin}${mapRoute(x.url.pathname) ?? x.url.pathname}`;
            href = mapRoute(href) ?? href;

            selectall<HTMLAnchorElement>("#sidebar-contents a:not(.btn)").forEach((e) => (e.style.backgroundColor = e.href === href ? "#00000022" : ""));
            for (const id of ["info-pages", "tools", "staff-area", "miscellaneous", "records", "admin", "admin-tools"])
                if (selectall<HTMLAnchorElement>(`#${id} a:not(.btn)`).some((e) => e.href === href)) openSections[id] = true;
        });

        doc = document;
    });

    const openSections: Record<string, boolean> = {};

    darkMode.subscribe((x) => doc && (doc.cookie = `mode=${x ? "dark" : "light"}; expires=${new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)}; path=/`));

    $: open &&
        selectall<HTMLAnchorElement>("#sidebar-contents a")
            .find((e) => e.href === href)
            ?.scrollIntoView({ block: "nearest" });
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.ctrlKey && e.key === "k") {
            e.preventDefault();
            open = !open;
        } else if (e.key === "Escape") {
            open = false;
        }
    }}
/>

<div id="toggle">
    <svg role="none" viewBox="0 0 100 100" class={open ? "open" : ""} on:click={() => (open = !open)}>
        <rect id="top" x="10" y="10" width="80" height="10" />
        <rect id="mid" x="10" y="45" width="80" height="10" />
        <rect id="bot" x="10" y="80" width="80" height="10" />
    </svg>
</div>

<div id="bar" class="bg-0" />
<div id="spacer" />

<div id="sidebar" class={open ? "open" : ""}>
    <div id="sidebar-contents">
        <a
            href={"javascript:void(0)"}
            class="btn t1"
            on:click={() => {
                darkMode.update((x) => !x);
            }}
        >
            <Icon icon={$darkMode ? "light_mode" : "dark_mode"} />
            Switch to {$darkMode ? "Light" : "Dark"} Mode
        </a>

        <a href="/" class="t1"><Icon icon="home" /> Home</a>
        <a href="/about" class="t1"><Icon icon="info" /> About Us</a>
        <a href="/partners" class="t1"><Icon icon="handshake" /> Partners</a>
        <a href="/join" class="t1"><Icon icon="meeting_room" /> Join</a>
        <a href="/info/constitution" class="t1"><Icon icon="account_balance" /> Constitution</a>
        <a href="/calendar" class="t1"><Icon icon="calendar_month" /> Calendar</a>
        <a href="/contact" class="t1"><Icon icon="call" /> Contact Us</a>

        <a href={"javascript:void(0)"} class="btn t1" on:click={() => (openSections["info-pages"] = !openSections["info-pages"])}>
            <Icon icon={openSections["info-pages"] ? "expand_more" : "chevron_right"} />
            Info Pages
        </a>

        <Show when={openSections["info-pages"]}>
            <span id="info-pages">
                <a href="/info/quickstart" class="t2"><Icon icon="developer_guide" /> Quickstart</a>
                <div>
                    <a href="/info/partner-list" class="t3"><Icon icon="list" /> Partner List &amp; Autosync</a>
                    <a href="/info/banshares" class="t3"><Icon icon="cell_tower" /> Banshares</a>
                    <a href="/info/global" class="t3"><Icon icon="language" /> Global Chat</a>
                    <a href="/info/other-bots" class="t3"><Icon icon="robot_2" /> Other Bots</a>
                </div>
                <a href="/info/discord" class="t2"><Icon icon="help" /> Discord Help</a>

                <a href={"javascript:void(0)"} class="btn t2" on:click={() => (openSections["miscellaneous"] = !openSections["miscellaneous"])}>
                    <Icon icon={openSections["miscellaneous"] ? "expand_more" : "chevron_right"} />
                    Miscellaneous
                </a>

                <Show when={openSections["miscellaneous"]}>
                    <div id="miscellaneous">
                        <a href="/info/glossary" class="t3"><Icon icon="dictionary" /> Glossary</a>
                        <a href="/info/exit-procedure" class="t3"><Icon icon="door_back" /> Exit Procedure</a>
                    </div>
                </Show>
            </span>
        </Show>

        <a href={"javascript:void(0)"} class="btn t1" on:click={() => (openSections.tools = !openSections.tools)}>
            <Icon icon={openSections.tools ? "expand_more" : "chevron_right"} />
            Tools
        </a>

        <Show when={openSections.tools}>
            <span id="tools">
                <a href="/tools/embeds" class="t2"><Icon icon="chat" /> Embeds</a>
                <a href="/tools/timestamps" class="t2"><Icon icon="schedule" /> Timestamp Generator</a>
                <a href="/tools/snowflakes" class="t2"><Icon icon="ac_unit" /> Snowflakes (IDs)</a>
                <a href="/tools/url-shortener" class="t2"><Icon icon="link" /> URL Shortener</a>
            </span>
        </Show>

        {#if $user}
            {#if $user.staff}
                <a href={"javascript:void(0)"} class="btn t1" on:click={() => (openSections["staff-area"] = !openSections["staff-area"])}>
                    <Icon icon={openSections["staff-area"] ? "expand_more" : "chevron_right"} />
                    Staff Area
                </a>

                <Show when={openSections["staff-area"]}>
                    <div id="staff-area">
                        <a href="/banshare" class="t2"><Icon icon="ios_share" /> Submit a Banshare</a>
                        {#if $user.council}
                            <a href="/vote" class="t2"><Icon icon="how_to_vote" /> Voting Center</a>
                        {/if}
                        {#if $user.council}
                            <a href="/docs" class="t2"><Icon icon="description" /> Documents</a>
                        {/if}

                        {#if $user.council}
                            <a href={"javascript:void(0)"} class="btn t2" on:click={() => (openSections["records"] = !openSections["records"])}>
                                <Icon icon={openSections["records"] ? "expand_more" : "chevron_right"} />
                                Records
                            </a>

                            <Show when={openSections["records"]}>
                                <div id="records">
                                    <a href="/records/membership-changes" class="t3"><Icon icon="history" /> Membership Changes</a>
                                    <a href="/records/observer-terms" class="t3"><Icon icon="view_timeline" /> Observer Terms</a>
                                    <a href="/records/observation-schedule" class="t3"><Icon icon="calendar_clock" /> Observation Schedule</a>
                                    <a href="/records/election-history" class="t3"><Icon icon="how_to_reg" /> Election History</a>
                                </div>
                            </Show>
                        {/if}
                    </div>
                </Show>
            {/if}

            {#if $user.observer}
                <a href={"javascript:void(0)"} class="btn t1" on:click={() => (openSections.admin = !openSections.admin)}>
                    <Icon icon={openSections.admin ? "expand_more" : "chevron_right"} />
                    Admin
                </a>

                <Show when={openSections.admin}>
                    {#if $user.observer}
                        <div id="admin">
                            <a href="/admin/api-manager" class="t2"><Icon icon="dashboard" /> API Manager</a>
                            <a href="/admin/files" class="t2"><Icon icon="folder_open" /> Files</a>
                            <a href="/admin/audit-logs" class="t2"><Icon icon="format_list_numbered" /> Audit Log</a>
                            <a href="/admin/monitor" class="t2"><Icon icon="monitor_heart" /> Monitor</a>
                            <a href="/admin/global" class="t2"><Icon icon="public" /> Global Chat</a>

                            <a href={"javascript:void(0)"} class="btn t2" on:click={() => (openSections["admin-tools"] = !openSections["admin-tools"])}>
                                <Icon icon={openSections["admin-tools"] ? "expand_more" : "chevron_right"} />
                                Admin Tools
                            </a>

                            <Show when={openSections["admin-tools"]}>
                                <div id="admin-tools">
                                    <a href="/admin/tools/weekly-summaries" class="t3"><Icon icon="summarize" /> Weekly Summaries</a>
                                </div>
                            </Show>
                        </div>
                    {/if}
                </Show>
            {/if}

            {#if $user.owner || $user.observer}
                <a href="/manage" class="t1"><Icon icon="settings" /> Manage {$user.observer ? "Servers" : "Your Server"}</a>
            {/if}

            <a href={"javascript:void(0)"} class="btn t1" on:click={() => fetch(`/logout`, { method: "post" }).then(() => location.reload())}>
                <Icon icon="logout" />
                Log Out
            </a>

            <a
                href={"javascript:void(0)"}
                class="btn t1"
                on:click={() => {
                    let first = true;
                    while (true) {
                        const input = prompt(
                            `${
                                first ? "" : "Input does not match."
                            } This will invalidate all of your API keys and log you out everywhere. If you are sure you want to do this, type your full Discord tag below.`,
                        );

                        first = false;

                        if (!input) return;
                        if (input !== $user?.tag) continue;

                        api($token, `POST /auth/invalidate`).then(() => location.reload());
                        return;
                    }
                }}
            >
                <Icon icon="dangerous" />
                Invalidate
            </a>
        {:else}
            <a href="/login" class="t1"><Icon icon="login" />Log In</a>
        {/if}
    </div>
    <div id="footer">
        {#if $user}
            <span class="text-2">
                Logged in as <Mention>{$user.tag}</Mention>
            </span>
            <br />
        {/if}
        &copy; 2023 TCN Development Team
        <br />
        <span class="text-2">Page last loaded: <Timestamp ms timestamp={Date.now()} /></span>
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

    #toggle {
        border-bottom-right-radius: 5px;
        height: 80px;
        position: fixed;
        z-index: 11;

        @media screen and (min-width: 1360px) {
            background-color: rgb(var(--bg-1));
        }
    }

    svg {
        cursor: pointer;
        height: 32px;
        outline: none;
        padding: 24px;
        width: 32px;
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
        top: 0;
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

    #sidebar-contents {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: scroll;
        padding-top: 80px;
        position: relative;
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
        padding-left: 2.5em;
    }

    .t3 {
        font-weight: 300;
        padding-left: 4em;
    }

    a {
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

    a:hover,
    a:focus {
        background-color: #00000011;
    }
</style>
