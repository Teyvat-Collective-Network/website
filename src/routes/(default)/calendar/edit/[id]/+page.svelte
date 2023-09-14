<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import Callout from "$lib/components/Callout.svelte";
    import DatetimeEditor from "$lib/components/DatetimeEditor.svelte";
    import EventModal from "$lib/components/EventModal.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import TextBadge from "$lib/components/TextBadge.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token, user } from "$lib/stores";
    import { onMount } from "svelte";

    const { isNew, event } = $page.data;
    let clone = JSON.stringify(event);

    const guilds = new Set<string>();
    const ids: Record<string, string> = {};
    const names: Record<string, string> = {};

    onMount(async () => {
        for (const code of event.invites)
            try {
                const {
                    guild: { id, name },
                } = await api($token, `GET /invite/${encodeURIComponent(code)}`);

                guilds.add(id);
                ids[code] = id;
                names[code] = name;
            } catch {}
    });

    let done = false;
    beforeNavigate(
        ({ cancel }) =>
            clone === JSON.stringify(event) || done || confirm("Are you sure you want to leave this page? You will lose any unsaved changes.") || cancel(),
    );

    async function addInvite() {
        const invite = prompt("Enter an invite code or link.");
        if (!invite) return;

        const req = await api($token, `!GET /invite/${encodeURIComponent(invite)}`);
        if (!req.ok) return alert("Invalid invite.");

        const {
            code,
            guild: { id, name },
        } = await req.json();

        if (event.invites.includes(code)) return alert("You already added this invite.");
        if (guilds.has(id)) return alert("You already added an invite to this guild.");

        ids[code] = id;
        names[code] = name;
        guilds.add(id);

        event.invites = [...event.invites, invite];
    }

    function removeInvite(code: string) {
        event.invites = event.invites.filter((x: string) => x !== code);
        guilds.delete(ids[code]);
        delete ids[code];
        delete names[code];
    }

    let open = false;
    let saved = 0;
    const previewObject: any = {};

    async function preview() {
        open = true;
        previewObject.body = await (await fetch(`/api/render`, { method: "POST", body: event.body })).text();
    }

    async function save() {
        if (clone !== JSON.stringify(event)) {
            if (!(event.title = event.title.trim())) return alert("Please enter a title.");
            if (!event.start) return alert("Please enter a start time.");
            if (!event.end) return alert("Please enter an end time.");
            if (!(event.body = event.body.trim())) return alert("Please enter a body.");

            const req = await api($token, isNew ? `!POST /events` : `!PUT /events/${event.id}`, event);
            if (!req.ok) return alert((await req.json()).message);

            if (isNew) {
                const { id } = await req.json();
                done = true;
                goto(`/calendar/edit/${id}`);
            } else clone = JSON.stringify(event);
        }

        saved++;
        setTimeout(() => saved--, 2000);
    }

    let start = event.start ? new Date(event.start) : undefined;
    let end = event.start ? new Date(event.end) : undefined;

    $: event.start = start?.getTime();
    $: event.end = end?.getTime();
</script>

<div class="container">
    <h2>{isNew ? "Creating" : "Editing"} Event</h2>
    <Link to="/calendar" class="row"><Icon icon="chevron_left" /> Return to Calendar</Link>
    <br />

    {#if !isNew && $user?.id !== event.owner}
        <Callout style="info">
            <p>You are editing <Link to="/user/{event.owner}" external><b><UserId id={event.owner} /></b></Link>'s event.</p>
        </Callout>
        <br />
    {/if}

    <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px 25px">
        <label for="title"><b>Title</b></label>
        <input id="title" type="text" bind:value={event.title} />
        <label for="start"><b>Start</b></label>
        <DatetimeEditor bind:value={start} />
        <label for="end"><b>End</b></label>
        <DatetimeEditor bind:value={end} />
        <label for="body"><b class="row">Body (<Icon icon="markdown" />)</b></label>
        <Textarea id="body" bind:value={event.body} />
        <b>Invites</b>
        <div class="row gap-1">
            {#each event.invites as code}
                <button class="void" on:click={() => removeInvite(code)}>
                    <TextBadge label={names[code] ?? ""}><code class="plain">{code}</code></TextBadge>
                </button>
            {/each}
            <button class="tp green-text" on:click={addInvite}><Icon icon="add" /></button>
        </div>
    </div>
    <p class="row gap-1">
        <button class="row" on:click={preview}><Icon icon="visibility" /> Preview</button>
        <button class="row" on:click={save}><Icon icon="save" /> {isNew ? "Create" : "Save"}</button>
        <span id="savebox" class="row" style={saved ? "" : "opacity: 0"}><Icon icon="check" class="green-text" /></span>
    </p>
</div>

<EventModal bind:open event={{ ...event, body: previewObject.body }} />

<style lang="scss">
    #savebox {
        transition: opacity 50ms;
    }
</style>
