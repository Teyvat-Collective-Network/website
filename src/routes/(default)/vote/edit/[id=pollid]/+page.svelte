<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import ListButton from "$lib/components/ListButton.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Redirect from "$lib/components/Redirect.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { token } from "$lib/stores";
    import { onMount } from "svelte";

    export let data: any;
    export let form: any;

    form ??= data.form ?? {};
    form.options ??= ["", ""];
    form.min ??= 1;
    form.max ??= 1;
    form.candidates ??= [];
    form.seats ??= 1;
    form.live ??= false;
    form.restricted ??= true;
    form.dm ??= true;
    form.quorum ??= 60;

    const mode = form.mode;

    const users: Record<string, string> = {};
    let done = false;

    onMount(async () => {
        const array = ((await api($token, `GET /users`)) as { id: string }[]).map(({ id }) => id);

        for (const id of array) users[id] = "";
        for (const id of array) users[id] = (await api($token, `GET /tag/${id}`)) || undefined;

        done = true;
    });

    async function del() {
        if (!confirm("Are you sure you wish to delete this poll? This action cannot be undone!")) return;

        const req = await api($token, `!DELETE /polls/${form.id}`);
        if (!req.ok) return alert((await req.json()).message);

        goto("/vote");
    }
</script>

{#if !data.form}
    <Redirect to="/vote" />
{/if}
<form class="container" method="POST">
    {#if form.error}
        <Callout style="red">
            <p>{@html form.error}</p>
        </Callout>
        <br />
    {/if}

    {#if form.id && form.id !== parseInt($page.params.id)}
        <Redirect to="/vote/edit/{form.id}" />
    {/if}

    <p><A to="/vote">Return to Dashboard</A></p>

    <div class="panel">
        <h4>Poll Options</h4>
        <p><b>Mode</b></p>
        <div class="row gap-1">
            <select name="mode" class="bg-2" bind:value={form.mode}>
                <option value="induction">Induction</option>
                <option value="proposal">Proposal</option>
                <option value="election">Election</option>
                <option value="selection">Selection</option>
            </select>
            {#if form.id && mode !== form.mode}
                <span class="red-text">Changing the poll mode will reset everyone's votes.</span>
            {/if}
        </div>
        <p>
            {#if form.mode === "induction"}
                <p><b>Server Name</b></p>
                <input required name="server" type="text" class="bg-2" bind:value={form.server} />
            {:else if form.mode === "election"}
                <p><b>Election Wave</b></p>
                <input required name="wave" type="number" class="bg-2" bind:value={form.wave} />
            {:else}
                <p><b class="row">Question (<Icon icon="markdown" /> &nbsp;supported)</b></p>
                <Textarea class="bg-2" bind:value={form.question} />
                <textarea name="question" bind:value={form.question} hidden />
            {/if}
        </p>
        {#if form.mode === "induction"}
            <p>
                <label>
                    <input name="preinduct" type="checkbox" class="bg-2" bind:checked={form.preinduct} />
                    <span>
                        <b>Pre-induct</b> (enable if the character has not been officially confirmed by Hoyoverse)
                    </span>
                </label>
            </p>
        {:else if form.mode === "election"}
            <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 10px 25px">
                <b>Seats</b>
                <input required name="seats" type="number" class="bg-2" bind:value={form.seats} />
                <span />
                <Loading {done} text="Loading council members...">
                    {#each form.candidates as candidate, index}
                        <b>Candidate {index + 1}</b>
                        <select name="candidate{index}" class="bg-2" bind:value={candidate}>
                            {#each Object.entries(users) as [id, tag]}
                                {#if tag}
                                    <option value={id} selected={id === candidate}>{tag}</option>
                                {/if}
                            {/each}
                        </select>
                        <span>
                            {#if form.candidates.length > 2}
                                <ListButton bind:array={form.candidates} {index} del />
                            {/if}
                        </span>
                    {/each}
                </Loading>
            </div>
            {#if form.candidates.length < 20}
                <br />
                <button type="button" on:click={() => (form.candidates = [...form.candidates, ""])}>Add Candidate</button>
            {/if}
        {:else if form.mode === "selection"}
            <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 10px 25px">
                <b>User must select at least:</b>
                <input required name="min" type="number" max={Math.min(form.options.length, form.max)} class="bg-2" bind:value={form.min} />
                <span />
                <b>User must select at most:</b>
                <input required name="max" type="number" min={form.min} class="bg-2" bind:value={form.max} />
                <span />
                {#each form.options as option, index}
                    <b>Option {index + 1}</b>
                    <input required name="option{index}" type="text" class="bg-2" bind:value={option} />
                    <span>
                        {#if form.options.length > 2}
                            <ListButton bind:array={form.options} {index} del />
                        {/if}
                    </span>
                {/each}
            </div>
            {#if form.options.length < 10}
                <br />
                <button type="button" on:click={() => (form.options = [...form.options, ""])}>Add Option</button>
            {/if}
        {/if}
        <p><b>Close after how many hours?</b></p>
        <input
            required
            name="duration"
            type="number"
            step="any"
            class="bg-2"
            placeholder="Minimum requirement for standard votes is 48"
            min={0}
            bind:value={form.duration}
        />
    </div>
    <div class="panel">
        <h4>Meta Options</h4>
        <label>
            <input name="live" type="checkbox" class="bg-2" bind:checked={form.live} />
            <span><b>Live</b> (display results in real-time - forbidden for standard votes)</span>
        </label>
        <label>
            <input name="restricted" type="checkbox" class="bg-2" bind:checked={form.restricted} />
            <span><b>Restricted</b> (only designated voters may vote)</span>
        </label>
        <label>
            <input name="dm" type="checkbox" class="bg-2" bind:checked={form.dm} />
            <span>
                <b>DM 24 hours before end</b> (required for standard votes)
                {#if form.id}
                    (if you are editing a poll for which a DM reminder has already been sent, enabling this option will send another DM)
                {/if}
            </span>
        </label>
        <br />
        <div class="row gap-1">
            <b>Quorum</b>
            <select required name="quorum" class="bg-2" bind:value={form.quorum}>
                <option value={0}>none</option>
                <option value={60}>60% (minor &mdash; standard)</option>
                <option value={75}>75% (major &mdash; amendments)</option>
            </select>
        </div>
    </div>
    <div class="panel">
        {#if form.id}
            <div class="row gap-1">
                <button>Edit / Post</button>
                <button type="button" class="red-button" on:click={del}>Delete</button>
            </div>
            <p>If the poll still exists, it will be edited. If not, it will be reposted.</p>
        {:else}
            <button>Post</button>
        {/if}
    </div>
</form>
