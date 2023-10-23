<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import Loading from "$lib/components/Loading.svelte";
    import PreviewEmbed from "$lib/components/PreviewEmbed.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
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
</script>

<div class="container">
    <div class="row gap-1">
        <button on:click={format}>format</button>
    </div>
    <br />
    <div style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr))">
        <Textarea autofocus rows={32} bind:value={source} on:input={updateURL} />
        <Loading {done}><PreviewEmbed {data} /></Loading>
    </div>
    <p class="red-text">{error}</p>
</div>
