<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { token, user } from "$lib/stores";

    let finished = false;
    beforeNavigate(({ cancel }) => finished || confirm("Are you sure you want to leave this page? You will lose any unsaved changes.") || cancel());

    export let form: any;

    let ids: string = form?.ids ?? "";

    $: valid = !!ids.match(/^\s*[1-9][0-9]{16,19}(\s+[1-9][0-9]{16,19})*\s*$/);
    $: idList = ids.trim().split(/\s+/);

    const tags: Record<string, string> = {};

    let open = false;
    let done = true;

    async function checkIDs() {
        open = true;
        done = false;

        for (const id of idList) {
            if (!open) break;

            tags[id] = await (await fetch(`/api/tag/${id}`)).text();
            if (!tags[id]) break;
        }

        done = true;
    }
</script>

<form class="container" method="post" on:submit={() => (finished = true)}>
    <h1>Submit Banshare</h1>
    {#if form?.error}
        <Callout style="red">
            <p>{@html form.error}</p>
        </Callout>
        <br />
    {:else if form?.success}
        <Callout style="green">
            <p>Thank you for submitting a banshare.</p>
        </Callout>
        <br />
    {/if}
    <LoggedInAs />
    <div class="panel">
        <h5>ID(s) of the offender(s)</h5>
        <input
            type="text"
            name="ids"
            placeholder="Space-separated list of IDs"
            class="bg-1 {ids.match(/^\s*[1-9][0-9]{16,19}(\s+[1-9][0-9]{16,19})*\s*$/) ? '' : 'error'}"
            required
            autocomplete="off"
            bind:value={ids}
        />
        {#if valid}
            <br /><br />
            <button type="button" on:click={checkIDs}>Check IDs</button>
        {:else}
            <br />
        {/if}
        <br />
        <hr />
        <h5>Reason</h5>
        <p>
            If you need more than 498 characters, you should probably be putting it into the evidence field instead. Make the reason something suitable for an
            audit log reason for the ban and include context in the next field.
        </p>
        <p>
            Please keep this as concise as possible and deliver the minimum necessary information here. A reasonable amount of formality is expected and
            banshares with jokes or non-serious reasons may be denied.
        </p>
        <Textarea name="reason" class="bg-1" value={form?.reason} placeholder="Required &mdash; Max length: 498 characters" required maxlength={498} />
        <br /><br />
        <hr />
        <h5>Evidence</h5>
        <p>
            Please upload images to <A to="https://imgur.com" external>Imgur</A> (or your image hosting platform of choice). Discord media links are
            <b>not allowed</b> because Discord has made changes that will cause static links to expire. This does not affect usage of Discord itself, but means that
            using Discord attachment links to share images is no longer viable.
        </p>
        <p>
            If you need more than 1000 characters, please <A to="/docs" external>create a document</A> and link it here. Include some basic information in the evidence
            so people can see roughly what your document contains.
        </p>
        <p>Provide sufficient evidence to verify your reason and for other staff to make an informed decision.</p>
        <Textarea name="evidence" class="bg-1" value={form?.evidence} placeholder="Required &mdash; Max length: 1000 characters" required maxlength={1000} />
    </div>
    <div class="panel">
        <h5>Server</h5>
        <p>Identify the server from which you are submitting this banshare.</p>
        <select name="server" class="bg-1" required value={form?.server}>
            {#each Object.entries($user?.guilds ?? {}).filter(([, { owner, advisor, staff, roles }]) => owner || advisor || staff) as [id]}
                <option value={id}>{#await api($token, `GET /guilds/${id}`)}{id}{:then { name }}{name}{/await}</option>
            {/each}
        </select>
    </div>
    <div class="panel">
        <h5>Severity</h5>
        <p>
            The severity is used to determine autobanning. P0 indicates the greatest threat. Refer to the <A to="/info/banshares#severity">info page</A> for more
            information.
        </p>
        <select name="severity" class="bg-1" value={form?.severity}>
            <option>P0</option>
            <option>P1</option>
            <option>P2</option>
            <option value="DM">DM Scam</option>
        </select>
    </div>
    <div class="panel">
        <h5>Urgency</h5>
        <p>Check the box below to ping all observers to review this banshare urgently.</p>
        <label>
            <input type="checkbox" name="urgent" class="bg-1" checked={form?.urgent} />
            <b>This banshare is urgent.</b>
        </label>
    </div>
    <div class="panel">
        <div class="row gap-1">
            <input type="submit" name="submit" value="Submit" />
            <input type="submit" name="submit" class="text-accent" value="Submit Without Validation" style="background-color: transparent" />
            <input type="submit" name="submit" class="red-text" value="Submit Without Checks" style="background-color: transparent" />
        </div>
        <p>
            <b>Warning:</b> You should only submit without checks if your ID list is a link. Doing this prevents autobanning. You should paste your entire ID list
            into the form if possible &mdash; the bot will parse the data and upload its own document if necessary.
        </p>
        <p>
            <b>This may take a long time</b> if you have submitted a long ID list, as the bot needs to fetch every user. If your list is very long, use "Submit Without
            Validation", which will still parse the IDs and ensure they are in the correct format, but won't fetch the users.
        </p>
    </div>
</form>
<Modal bind:open>
    <h2>Banshare Targets</h2>
    <Loading {done} />
    {#if idList.some((x) => tags[x] === "")}
        {#if !done}
            <br />
        {/if}
        <Callout style="red">
            <p>One or more user IDs you entered is invalid.</p>
        </Callout>
        <br />
    {/if}
    <ul class="space">
        {#each idList.filter((x) => tags[x] === "") as id}
            <li class="red-text"><code>{id}</code> - <b>INVALID</b></li>
        {/each}
        {#each idList.filter((x) => tags[x]) as id}
            <li><code>{id}</code> - <b>{tags[id]}</b></li>
        {/each}
        {#each idList.filter((x) => tags[x] === undefined) as id}
            <li><code>{id}</code> - (loading...)</li>
        {/each}
    </ul>
</Modal>

<style lang="scss">
    .error {
        outline: 2px solid rgb(var(--red-text));
    }
</style>
