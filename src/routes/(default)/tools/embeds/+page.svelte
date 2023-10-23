<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import Expand from "$lib/components/Expand.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import PreviewEmbed from "$lib/components/PreviewEmbed.svelte";
    import Show from "$lib/components/Show.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { alerts } from "$lib/stores";
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
        if (!source) source = "a = 1";

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

    let open = true;

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
            </div>
            <Textarea autofocus rows={32} bind:value={source} on:input={updateURL} />
        </div>
        <div>
            <Loading {done}><PreviewEmbed {data} /></Loading>
        </div>
    </div>
    <p class="red-text">{error}</p>
</div>

<style lang="scss">
    #inputs {
        font-size: 90%;

        button {
            padding: 0 0.8em;
        }
    }
</style>
