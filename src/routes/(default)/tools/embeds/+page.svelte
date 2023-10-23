<script context="module" lang="ts">
    const init = `# Use 0x for hex codes.\n# This sets the default embed color.\n# You can override this per embed.\ncolor = 0x2b2d31\n\ncontent = """\nHello, World!\nThis is a multiline string. \\nPut a backslash at the end of a line to avoid line-breaking.\n\n<@1> <@&1> <#1>\n...\n"""\n\n[profile]\nname = "Webhook Display Name"\navatar = "https://teyvatcollective.network/favicon.png"\n\n[[embed]] # it is important that this is [[]] and not []\ntitle = "Hello!"\ndescription = "This is the TCN's TOML-based embed utility."\nurl = "https://teyvatcollective.network"\n\n# the below fields can be in any order\n\n[embed.author] # this must come after the above data\nname = "author name"\nicon = "https://teyvatcollective.network/favicon.png"\n\n[[embed.field]] # also must be [[]]\nname = "a"\nvalue = "b"\ninline = true\n\n[[embed.field]]\nname = "c"\nvalue = "d"\ninline = true\n\n[[embed.field]]\nname = "e"\nvalue = "f"\n\n[embed.footer]\ntext = "footer text"\nicon = "https://teyvatcollective.network/favicon.png"\n\n# this is a new embed\n\n[[embed]]\ntitle = "a"\ncolor = 0x009688\nfield = [\n    { name = "this is a", value = "shorter way" },\n    { name = "to define", value = "an embed's fields" }\n]\nthumbnail = "https://teyvatcollective.network/favicon.png"\nimage = "https://i.imgur.com/r32P1Ay.png"\nfooter = { text = "shorter way to define a footer", icon = "https://teyvatcollective.network/favicon.png" }`;
</script>

<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Expand from "$lib/components/Expand.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import PreviewEmbed from "$lib/components/PreviewEmbed.svelte";
    import Show from "$lib/components/Show.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { alerts, token } from "$lib/stores";
    import { unzip, zip } from "$lib/zip";
    import TOML from "@iarna/toml";
    import TDE from "@teyvat-collective-network/toml-discord-embeds";
    import { onMount } from "svelte";

    let source: string = "";
    let data: any;

    let done = false;

    function updateURL() {
        try {
            const params = new URLSearchParams(location.search);
            const key = source && zip(source).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

            if (key === params.get("data")) return;

            params.set("data", key);
            goto(`${location.pathname}?${params}`, { replaceState: true, keepFocus: true });
        } catch {}
    }

    onMount(() => {
        const load = new URLSearchParams(location.search).get("data");

        if (load) source = unzip(load.replace(/-/g, "+").replace(/_/g, "/"));
        if (!source) source = init;

        updateURL();

        done = true;
    });

    let error = "";

    $: try {
        data = TDE.convert(TOML.parse(source));
        error = "";
    } catch (e) {
        error = `${e}`;
    }

    afterNavigate(() => updateURL());

    function format() {
        source = TOML.stringify(TOML.parse(source));
        updateURL();
    }

    let webhook: string = "";
    let forumThreadName: string = "";
    let threadIDOrURL: string = "";
    let messageIDOrURL: string = "";

    let open = true,
        showError = false,
        showShare = false;

    const IDorURL = /^(|\d+|https:\/\/([^.]+\.)?discord\.com\/channels\/[1-9][0-9]{16,19}\/[1-9][0-9]{16,19}\/[1-9][0-9]{16,19})$/;

    $: webhookValid = !!webhook?.match(/^https:\/\/([^.]+\.)?discord\.com\/api\/webhooks\/[1-9][0-9]{16,19}\/[^?]+$/);
    $: threadValid = !!threadIDOrURL?.match(IDorURL);
    $: messageValid = !!messageIDOrURL?.match(IDorURL);

    async function send() {
        const threadID = threadIDOrURL.match(/\d+$/)?.[0];
        const messageID = messageIDOrURL.match(/\d+$/)?.[0];

        const req = await fetch(
            `${webhook}${messageID ? `/messages/${messageID}` : ""}?${new URLSearchParams({
                wait: "true",
                ...(threadID ? { thread_id: threadID } : {}),
            })}`,
            {
                method: messageID ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, thread_name: forumThreadName || undefined }),
            },
        );

        if (!req.ok) return alert((await req.json()).message);

        const res = await req.json();

        if (forumThreadName) {
            forumThreadName = "";
            threadIDOrURL = res.channel_id;
        }

        messageIDOrURL = res.id;

        const store = alerts[messageIDOrURL ? "edited" : "sent"];
        store.update((x) => x + 1);
        setTimeout(() => store.update((x) => x - 1), 1500);
    }

    let shareLink: string;

    async function share() {
        shareLink = "";
        showShare = true;

        const res = await api(
            $token,
            `POST /share-links`,
            source
                .trim()
                .split("\n")
                .map((x) => x.trimEnd())
                .join("\n")
                .replace(/\n\n+/g, "\n\n"),
        ).catch(alert);

        if (!res) return;

        shareLink = `${PUBLIC_DOMAIN}/tools/embeds/${res.id}`;
    }

    function copy() {
        navigator.clipboard.writeText(shareLink);
        alerts.copy.update((x) => x + 1);
        setTimeout(() => alerts.copy.update((x) => x - 1), 1500);
    }
</script>

<div class="container">
    <div style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr))">
        <div class="col no-center gap-1">
            <div id="inputs" class="panel m-0">
                <div class="row" style="justify-content: space-between">
                    <h5 class="short">Send Options</h5>
                    <Expand bind:open />
                </div>
                <Show when={open}>
                    <b>Webhook URL</b>
                    <div class="gap-1" style="display: grid; grid-template-columns: 1fr auto">
                        <input type="text" class={webhookValid ? "" : "error"} bind:value={webhook} />
                        <button class="green-button" disabled={!webhookValid || !threadValid || !messageValid} on:click={send}>
                            {messageIDOrURL ? "edit" : "send"}
                        </button>
                    </div>
                    <b>Forum Thread Name</b>
                    <input type="text" bind:value={forumThreadName} readonly={!!threadIDOrURL || !!messageIDOrURL} />
                    <b>Thread ID or URL</b>
                    <input type="text" class={threadValid ? "" : "error"} bind:value={threadIDOrURL} readonly={!!forumThreadName} />
                    <b>Message ID or URL</b>
                    <input type="text" class={messageValid ? "" : "error"} bind:value={messageIDOrURL} readonly={!!forumThreadName} />
                </Show>
            </div>
            <div class="row gap-1">
                <button on:click={format}>format</button>
                <button class="tp {error ? 'red-text' : ''}" on:click={() => (showError = true)} disabled={!error}>show error</button>
                <button on:click={share}>share</button>
            </div>
            <Textarea autofocus rows={32} bind:value={source} on:input={updateURL} />
        </div>
        <div>
            <div class="{error ? 'error' : ''} round">
                <Loading {done}><PreviewEmbed {data} /></Loading>
            </div>
        </div>
    </div>
</div>
<Modal bind:open={showError}><pre><code>{error}</code></pre></Modal>
<Modal bind:open={showShare}>
    <p>
        <b class="red-text">Warning:</b> This share link will expire after a week of not being accessed. To get a permanent link, copy the URL out of the
        browser bar into <A to="https://tinyurl.com" external>TinyURL</A> or a similar service.
    </p>
    <div class="col">
        <Loading done={shareLink}>
            <div class="row gap-3 bg-1 round" style="padding: 0.2em 1em">
                <A to={shareLink}>{shareLink}</A>
                <button on:click={copy}><Icon icon="content_copy" /></button>
            </div>
        </Loading>
    </div>
</Modal>

<style lang="scss">
    #inputs {
        font-size: 90%;

        button {
            padding: 0 0.8em;
        }
    }
</style>
