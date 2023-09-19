<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Show from "$lib/components/Show.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { token, user } from "$lib/stores";

    export let form: any;

    let ids: string = form?.ids ?? "";
    let idList: string[] = [];
    let valid = false;
    $: valid = !!ids.match(/^\s*(\d{17,20}\s+)*\d{17,20}\s*$/);
    $: idList = valid ? ids.trim().split(/\s+/) : [];

    let reason: string = form?.reason ?? "";
    let trimmedReason = "";
    $: trimmedReason = reason.trim();

    let evidence: string = form?.evidence ?? "";
    let trimmedEvidence = "";
    $: trimmedEvidence = evidence.trim();

    let server: string = form?.server ?? "";
    let severity: string = form?.severity ?? "";
    let urgent = !!form?.urgent;

    let open = false;

    const map: Record<string, string> = {};
    let invalid = "";
    let done = false;

    async function check_ids() {
        invalid = "";
        done = false;
        open = true;

        try {
            for (const id of ids.trim().split(/\s+/)) {
                if (!open) return;
                if (map[id]) continue;

                map[id] = await api($token, `GET /tag/${id}`);
                if (!map[id]) return (invalid = id);
            }
        } finally {
            done = true;
        }
    }
</script>

<form method="post">
    {#if form?.error}
        <Callout style="red">
            <p class="row gap-1">
                <span>{@html form.error}</span>
                <button class="bg-4" on:click={() => (form.error = "")}>Dismiss</button>
            </p>
        </Callout>
        <br />
    {/if}
    {#if form?.success}
        <Callout style="green">
            <p class="row gap-1">
                <span>Thank you for submitting a banshare. We will review it as soon as possible. </span>
                <button class="bg-4" on:click={() => (form.success = false)}>Dismiss</button>
            </p>
        </Callout>
        <br />
    {/if}
    <div class="panel">
        <h4>ID(s) of the offender(s)</h4>
        <p>Whitespace-separated list of IDs:</p>
        <input required name="ids" type="text" class="bg-2 mono {valid ? '' : 'error'}" bind:value={ids} />
        <Show when={valid}>
            <br />
            <button type="button" on:click={check_ids}>Check IDs</button>
        </Show>
        <h4>Reason</h4>
        <p>
            If you need more than 498 characters, you should probably be putting it in the evidence field instead. <b>Tip:</b> Make the reason suitable for use as
            an audit log reason for the ban. Include any context in the evidence field.
        </p>
        <Textarea id="reason" class="bg-2 mono {trimmedReason && trimmedReason.length <= 498 ? '' : 'error'}" bind:value={reason} />
        <p class="red-text">
            {#if !trimmedReason}
                Required.
            {:else if trimmedReason.length > 498}
                Maximum length: 498.
            {/if}
        </p>
        <textarea name="reason" bind:value={trimmedReason} hidden />
        <h4>Evidence</h4>
        <p>
            Please upload images to <A to="https://imgur.com" external>Imgur</A>. Discord image links work too, but keep in mind that they will become invalid
            if the message containing the image is deleted. We strongly advise uploading sensitive evidence to Imgur and marking it as "Mature" for safety
            purposes.
        </p>
        <p>
            If you need more than 1000 characters, please <A to="/documents" external>create a document</A> and link it here. Include some basic information in the
            evidence so people can see roughly what your document contains.
        </p>
        <p>Provide sufficient evidence to verify your reason and for other staff to make an informed decision.</p>
        <Textarea id="evidence" class="bg-2 mono {trimmedEvidence && trimmedEvidence.length <= 1000 ? '' : 'error'}" bind:value={evidence} />
        <p class="red-text">
            {#if !trimmedEvidence}
                Required.
            {:else if trimmedEvidence.length > 1000}
                Maximum length: 1000.
            {/if}
        </p>
        <textarea name="evidence" bind:value={trimmedEvidence} hidden />
    </div>
    <div class="panel">
        <h4>Server</h4>
        <p>Identify from which server you are submitting this banshare.</p>
        <select required name="server" class="bg-2" bind:value={server}>
            <option selected disabled hidden value="">Select a Server</option>
            {#each Object.entries($user?.guilds ?? {}).filter(([, { owner, advisor, staff, roles }]) => owner || advisor || (staff && roles.includes("banshares"))) as [id]}
                <option value={id}>{#await api($token, `GET /guilds/${id}`)}{id}{:then { name }}{name}{/await}</option>
            {/each}
        </select>
    </div>
    <div class="panel">
        <h4>Severity</h4>
        <p>
            The severity is used to determine autobanning. P0 indicates the greatest threat. Refer to the <A to="/info/banshares#severity">info page</A> for more
            information.
        </p>
        <select required name="severity" class="bg-2" bind:value={severity}>
            <option selected disabled hidden value="">Select Severity</option>
            <option>P0</option>
            <option>P1</option>
            <option>P2</option>
            <option value="DM">DM Scam</option>
        </select>
    </div>
    <div class="panel">
        <h4>Urgency</h4>
        <p>Check the box below to ping all observers to review this banshare urgently.</p>
        <label>
            <input type="checkbox" name="urgent" class="bg-2" bind:checked={urgent} />
            <b>This banshare is urgent.</b>
        </label>
    </div>
    <div class="panel">
        <div class="row gap-1">
            <input type="submit" name="submit" value="Submit" />
            <input type="submit" name="submit" value="Submit Without Validation" />
            <input type="submit" name="submit" value="Submit Without Checks" />
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
    <Loading {done} />
    {#if invalid}
        <Callout style="red">
            <p>Invalid ID: <code>{invalid}</code> did not correspond to a valid user.</p>
        </Callout>
    {:else}
        <ul>
            {#each idList as id}
                {#if map[id]}
                    <li><code>{id}</code> &mdash; <Mention>{map[id]}</Mention></li>
                {/if}
            {/each}
        </ul>
    {/if}
</Modal>
