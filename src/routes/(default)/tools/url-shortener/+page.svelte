<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import api from "$lib/api";
    import Icon from "$lib/components/Icon.svelte";
    import { alerts, token } from "$lib/stores";

    let url = "";
    let id = "";
    let done = false;

    async function shorten() {
        url = url.trim();
        if (!url.match(/^https?:\/\//)) return alert("That does not look like a valid URL.");

        id = id.trim();
        if (id && id.length < 4) return alert("Alias must be at least 4 characters.");

        if (
            url.length <= PUBLIC_DOMAIN.length + 6 + (id.length || 8) &&
            !confirm("The shortened URL will not be any shorter than the input URL. Are you sure you want to continue?")
        )
            return;

        const res = await api($token, `POST /short-links${id ? `?${new URLSearchParams({ id })}` : ""}`, url).catch(alert);
        if (!res) return;

        id = res.id;
        done = true;
    }

    function copy() {
        navigator.clipboard.writeText(`${PUBLIC_DOMAIN}/link/${id}`);
        alerts.copy.update((x) => x + 1);
        setTimeout(() => alerts.copy.update((x) => x - 1), 1500);
    }
</script>

<div class="container">
    <h1>URL Shortener</h1>
    <div class="container-tight">
        <div class="panel">
            {#if done}
                <h5 class="short">Your Long URL</h5>
                <input type="text" value={url} readonly />
                <h5 class="short">Shortened URL</h5>
                <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 10px">
                    <input type="text" value="{PUBLIC_DOMAIN}/link/{id}" readonly />
                    <button on:click={copy}><Icon icon="content_copy" /></button>
                </div>
                <hr />
                <button on:click={() => ((url = ""), (id = ""), (done = false))}>Shorten Another</button>
            {:else}
                <h5 class="short">Shorten a URL</h5>
                <input type="text" placeholder="Enter URL Here" bind:value={url} />
                <h5 class="short">Customize Short URL</h5>
                <div style="display: grid; grid-template-columns: auto 1fr; align-items: center">
                    <b>{PUBLIC_DOMAIN}/link/</b>
                    <input type="text" placeholder="Enter Alias (Optional)" bind:value={id} />
                </div>
                <hr />
                <button on:click={shorten} disabled={!url.trim().match(/^https?:\/\//)}>Shorten!</button>
            {/if}
        </div>
    </div>
</div>
