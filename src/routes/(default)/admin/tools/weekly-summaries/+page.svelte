<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_DOMAIN, PUBLIC_WEEKLY_SUMMARY_OBSERVER_PING_ROLE, PUBLIC_WEEKLY_SUMMARY_PING_ROLE } from "$env/static/public";
    import api from "$lib/api";
    import Icon from "$lib/components/Icon.svelte";
    import PreviewEmbed from "$lib/components/PreviewEmbed.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { alerts, token, user } from "$lib/stores";
    import { unzip, zip } from "$lib/zip";
    import { onMount } from "svelte";

    let fields = Object.fromEntries(
        ["past week", "ongoing", "observations", "to-do / upcoming", "membership changes", "constitutional amendments", "ongoing votes"].map((x) => [x, ""]),
    );

    const optional = ["constitutional amendments"];

    function updateURL() {
        try {
            const params = new URLSearchParams(location.search);
            const key = zip(JSON.stringify(fields)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

            if (key === params.get("data")) return;

            params.set("data", key);
            goto(`${location.pathname}?${params}`, { replaceState: true, keepFocus: true, noScroll: true });
        } catch {}
    }

    onMount(() => {
        const load = new URLSearchParams(location.search).get("data");

        if (load) fields = JSON.parse(unzip(load.replace(/-/g, "+").replace(/_/g, "/")));
        updateURL();
    });

    $: data = {
        content: `<@&${PUBLIC_WEEKLY_SUMMARY_PING_ROLE}>`,
        username: "TCN Weekly Summary",
        avatarURL: `${PUBLIC_DOMAIN}/favicon.png`,
        embeds: [
            {
                title: "**Your Weekly Summary**",
                color: 0x2b2d31,
                fields: Object.entries(fields)
                    .filter(([, y]) => y)
                    .map(([x, y]) => ({ name: `**${x}**`, value: y })),
                footer: Object.entries(fields).some(([x, y]) => !optional.includes(x) && !y)
                    ? {
                          text: `empty sections: ${Object.entries(fields)
                              .filter(([, y]) => !y)
                              .map(([x]) => x)
                              .join(", ")}`,
                      }
                    : null,
            },
        ],
    };

    async function getLink() {
        const res = await api($token, `POST /share-links?secret=true`, JSON.stringify(fields)).catch(alert);
        if (!res) return;

        return `${PUBLIC_DOMAIN}/admin/tools/weekly-summaries/${res.id}`;
    }

    async function post() {
        if (!confirm("Post the weekly summary to #summaries?")) return;

        const webhook = await (await fetch(`/api/webhooks/summaries`)).text();
        const req = await fetch(`${webhook}?wait=true`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

        if (!req.ok) return alert((await req.json()).message);

        alerts.sent.update((x) => x + 1);
        setTimeout(() => alerts.sent.update((x) => x - 1), 1500);
    }

    async function amend() {
        const id = prompt("Enter the ID of the summary to amend. Leave blank or cancel to cancel this action.");
        if (!id) return;

        if (!id.match(/^[1-9][0-9]{16,19}$/)) return alert("That ID looks invalid.");

        const webhook = await (await fetch(`/api/webhooks/summaries`)).text();

        const req = await fetch(`${webhook}/messages/${id}?wait=true`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        let fail: string | undefined;

        if (!req.ok) fail = (await req.json()).message;

        if (fail) {
            const webhook = await (await fetch(`/api/webhooks/observer-gallery`)).text();
            const link = await getLink();

            const req = await fetch(`${webhook}/messages/${id}?wait=true`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    content: `<@&${PUBLIC_WEEKLY_SUMMARY_OBSERVER_PING_ROLE}> <@${
                        $user!.id
                    }> is requesting your review on this weekly summary (you can edit it at ${link}).`,
                }),
            });

            if (!req.ok) return alert(fail);
        }

        alerts.edited.update((x) => x + 1);
        setTimeout(() => alerts.edited.update((x) => x - 1), 1500);
    }

    async function draft() {
        if (!confirm("Send as a draft to #observer-chat?")) return;

        const link = await getLink();

        const webhook = await (await fetch(`/api/webhooks/observer-gallery`)).text();

        const req = await fetch(`${webhook}?wait=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                content: `<@&${PUBLIC_WEEKLY_SUMMARY_OBSERVER_PING_ROLE}> <@${
                    $user!.id
                }> is requesting your review on this weekly summary (you can edit it at ${link}).`,
            }),
        });

        if (!req.ok) return alert((await req.json()).message);

        alerts.sent.update((x) => x + 1);
        setTimeout(() => alerts.sent.update((x) => x - 1), 1500);
    }

    async function copy() {
        const link = await getLink();
        if (!link) return;

        navigator.clipboard.writeText(link);

        alerts.copy.update((x) => x + 1);
        setTimeout(() => alerts.copy.update((x) => x - 1), 1500);
    }
</script>

<h1>Weekly Summaries</h1>
<div style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr))">
    <div class="panel col no-center gap-1">
        {#each Object.keys(fields) as key}
            <b>{key}</b>
            <Textarea rows={2} bind:value={fields[key]} on:input={updateURL} />
        {/each}
        <div class="row gap-1">
            <button class="tp text-accent" on:click={post}><Icon icon="send" /></button>
            <button class="tp text-accent" on:click={amend}><Icon icon="edit" /></button>
            <button class="tp text-accent" on:click={draft}><Icon icon="draft" /></button>
            <button class="tp text-accent" on:click={copy}><Icon icon="link" /></button>
        </div>
    </div>
    <div>
        <PreviewEmbed {data} />
    </div>
</div>
