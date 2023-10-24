<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Show from "$lib/components/Show.svelte";
    import { alerts, token } from "$lib/stores";

    let url = "";
    let id = "";
    let done = false;

    async function shorten() {
        url = url.trim();
        if (!url.match(/^https?:\/\//)) return alert("That does not look like a valid URL.");

        id = id.trim();
        if (id && id.length < 4) return alert("Alias must be at least 4 characters.");

        if (id) {
            const owned = await api($token, `GET /short-links/${id}/owns`);
            if (owned && !confirm("This ID is already in use by you. Do you want to overwrite it?")) return;
        }

        const res = await api($token, `POST /short-links${id ? `?${new URLSearchParams({ id })}` : ""}`, url).catch(alert);
        if (!res) return;

        id = res.id;
        done = true;

        if (viewing) await view();
    }

    function copy() {
        navigator.clipboard.writeText(`${PUBLIC_DOMAIN}/link/${id}`);
        alerts.copy.update((x) => x + 1);
        setTimeout(() => alerts.copy.update((x) => x - 1), 1500);
    }

    function goAgain() {
        url = "";
        id = "";
        done = false;
    }

    let viewing = false;
    let loading = false;
    let urls: [string, string][] = [];

    async function view() {
        loading = true;
        viewing = true;
        urls = (await api($token, `GET /short-links`)).sort();
        loading = false;
    }

    function edit(input: string) {
        url = urls.find(([x]) => x === input)![1];
        id = input;
        done = false;
    }

    async function del(id: string) {
        if (!confirm("Are you sure?")) return;

        await api($token, `DELETE /short-links/${id}`).catch(alert);
        await view();
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
            {:else}
                <h5 class="short">Shorten a URL</h5>
                <input type="text" placeholder="Enter URL Here" bind:value={url} />
                <h5 class="short">Customize Short URL</h5>
                <div style="display: grid; grid-template-columns: auto 1fr; align-items: center">
                    <b>{PUBLIC_DOMAIN}/link/</b>
                    <input type="text" placeholder="Enter Alias (Optional)" bind:value={id} />
                </div>
            {/if}
            <hr />
            <div class="row gap-1">
                <button on:click={done ? goAgain : shorten} disabled={!done && !url.trim().match(/^https?:\/\//)}>
                    {done ? "Shorten Another" : "Shorten!"}
                </button>
                <button on:click={() => (viewing ? (viewing = false) : view())}>{viewing ? "Hide" : "View your URLs"}</button>
            </div>
            <Show when={viewing}>
                <hr />
                <Loading done={!loading}>
                    <div class="gap-1" style="display: grid; grid-template-columns: min-content 1fr min-content">
                        {#each urls as [id, url]}
                            <span><code>{id}</code></span>
                            <span>{url}</span>
                            <span class="row gap-1 no-wrap">
                                <A href={"javascript:void(0)"} class="inline-row" on:click={() => edit(id)}><Icon icon="edit" /></A>
                                <A href={"javascript:void(0)"} class="inline-row red-text" on:click={() => del(id)}><Icon icon="delete" /></A>
                            </span>
                        {/each}
                    </div>
                </Loading>
            </Show>
        </div>
    </div>
</div>
