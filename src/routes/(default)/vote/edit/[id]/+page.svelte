<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import ListButtons from "$lib/components/ListButtons.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { alerts, token } from "$lib/stores";
    import type { Poll } from "$lib/types";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    const { save: saveStore } = alerts;

    let poll: Poll;
    let failed: boolean, done: boolean;

    onMount(async () => {
        if ($page.params.id === "new")
            poll = {
                mode: "proposal",
                question: "",
                duration: 48,
                dm: true,
                live: false,
                restricted: true,
                quorum: 60,
            };
        else
            try {
                poll = await api($token, `GET /polls/${$page.params.id}`);
            } catch (error) {
                alert(error);
                failed = true;
            }

        done = true;
    });

    function update(mode: string) {
        poll &&= {
            mode,
            ...{
                proposal: { question: "" },
                induction: { preinduct: false, server: "" },
                election: { wave: 1, seats: 1, candidates: [] },
                selection: { question: "", min: 1, max: 1, options: ["", ""] },
            }[mode],
            duration: poll.duration,
            dm: poll.dm,
            live: poll.live,
            restricted: poll.restricted,
            quorum: poll.quorum,
        } as Poll;
    }

    let leave = false;
    beforeNavigate(({ cancel }) => failed || leave || confirm("Are you sure you want to leave this page? Any unsaved work will be lost.") || cancel());

    function addCandidate() {
        if (poll.mode !== "election") return;

        const id = prompt("Enter the ID of the candidate to add.");
        if (!id) return;
        if (!id.match(/^[1-9][0-9]{16,19}$/)) return alert("Invalid ID; expected a 17-20 digit number.");
        if (poll.candidates.includes(id)) return alert("That user is already a candidate.");

        poll.candidates = [...poll.candidates, id];
    }

    async function save() {
        if (poll.mode === "proposal") {
            if (poll.question.trim() === "") return alert("Question is required.");
        } else if (poll.mode === "induction") {
            if (poll.server.trim() === "") return alert("Server name is required.");
        } else if (poll.mode === "election") {
            if (poll.wave < 1) return alert("Wave must be a positive number.");
            if (poll.seats < 1) return alert("Seats must be a positive number.");
            if (poll.candidates.length < 2) return alert("At least two candidates are required.");
        } else if (poll.mode === "selection") {
            if (poll.question.trim() === "") return alert("Question is required.");
            if (poll.options.length < 2) return alert("At least two options are required.");
            if (poll.options.some((x) => x.trim() === "")) return alert("All options are required to be non-empty.");
        }

        try {
            if ($page.params.id === "new") {
                const { id } = await api($token, `POST /polls`, poll);

                leave = true;
                goto(`/vote/edit/${id}`);
            } else {
                await api($token, `PUT /polls/${$page.params.id}`, { ...poll });
                saveStore.update((x) => x + 1);
                setTimeout(() => saveStore.update((x) => x - 1), 1500);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function del() {
        if (!confirm("Are you sure you want to delete this poll? This action is irreversible!")) return;

        await withAudit(
            "Confirm again that you want to permanently and irreversibly delete this poll, also clearing all records of any votes on it.",
            async (reason) => {
                try {
                    await api($token, `DELETE /polls/${$page.params.id}`, undefined, reason);

                    leave = true;
                    goto("/vote");
                } catch (error) {
                    alert(error);
                }
            },
            true,
        );
    }
</script>

<A to="/vote">Voting Center</A>
<br /><br />
<Loading {done}>
    {#if failed}
        <Callout style="red">
            <p>This poll does not exist.</p>
        </Callout>
    {:else}
        <div class="panel">
            <h3 class="short">Poll Data</h3>
            <div class="row gap-1">
                <b>Mode:</b>
                {#if $page.params.id === "new"}
                    <select class="bg-1" bind:value={poll.mode} on:input={(e) => update(e.currentTarget.value)}>
                        <option value="proposal">Proposal</option>
                        <option value="induction">Induction</option>
                        <option value="election">Election</option>
                        <option value="selection">Selection</option>
                    </select>
                    <span class="red-text"><b>Warning:</b> Editing the mode will reset your question data.</span>
                {:else}
                    {poll.mode[0].toUpperCase()}{poll.mode.slice(1)}
                {/if}
            </div>
            <br />
            {#if poll.mode === "proposal"}
                <Textarea class="bg-1" placeholder="Question (Discord markdown supported)" maxlength={256} bind:value={poll.question} />
            {:else if poll.mode === "induction"}
                <div class="fields">
                    <b>Server Name</b>
                    <input type="text" class="bg-1" maxlength={64} bind:value={poll.server} />
                </div>
                <br />
                <label>
                    <input type="checkbox" class="bg-1" bind:checked={poll.preinduct} />
                    <b>Pre-induct</b> (the character is not officially confirmed to be playable)
                </label>
            {:else if poll.mode === "election"}
                <div class="fields">
                    <b>Wave</b>
                    <input type="number" class="bg-1" bind:value={poll.wave} />
                    <b># of seats</b>
                    <input type="number" class="bg-1" bind:value={poll.seats} />
                </div>
                <h5>Candidates:</h5>
                {#if poll.candidates.length > 0}
                    <div class="fields">
                        {#each poll.candidates as id}
                            <A class="row red-text" on:click={() => poll.mode === "election" && (poll.candidates = poll.candidates.filter((x) => x !== id))}>
                                <Icon icon="delete" />
                            </A>
                            <span>
                                <UserMention {id} />
                            </span>
                        {/each}
                    </div>
                    <br />
                {/if}
                {#if poll.candidates.length < 20}
                    <p><A class="inline-row gap-1" on:click={addCandidate}><Icon icon="add" /> Add Candidate</A></p>
                {/if}
            {:else if poll.mode === "selection"}
                <Textarea class="bg-1" placeholder="Question (Discord markdown supported)" maxlength={256} bind:value={poll.question} />
                <br /><br />
                <div class="selection-fields">
                    <b>Must select &ge;</b>
                    <input type="number" class="bg-1 two-cols" bind:value={poll.min} />
                    <b>Must select &le;</b>
                    <input type="number" class="bg-1 two-cols" bind:value={poll.max} />
                    {#each poll.options as _, index}
                        <b>Option {index + 1}</b>
                        <input type="text" class="bg-1" bind:value={poll.options[index]} />
                        <span class="row gap-1"><ListButtons bind:array={poll.options} {index} hide_del={poll.options.length <= 2} /></span>
                    {/each}
                </div>
                {#if poll.options.length < 10}
                    <p>
                        <A class="row gap-1" on:click={() => poll.mode === "selection" && (poll.options = poll.options.concat([""]))}>
                            <Icon icon="add" /> Add Option
                        </A>
                    </p>
                {/if}
            {/if}
            <hr />
            <p class="row gap-1">
                Close after
                <span><input type="number" class="bg-1" bind:value={poll.duration} /></span>
                hours
            </p>
        </div>
        <div class="panel">
            <h3 class="short">Metadata</h3>
            <label>
                <input type="checkbox" class="bg-1" bind:checked={poll.live} />
                <b>Live</b> (display results in realtime &mdash; forbidden for standard votes)
            </label>
            <label>
                <input type="checkbox" class="bg-1" bind:checked={poll.restricted} />
                <b>Restricted</b> (only designated voters may vote)
            </label>
            <label>
                <input type="checkbox" class="bg-1" bind:checked={poll.dm} />
                <b>DM Reminder</b> (required for standard votes)
            </label>
            <br />
            <div class="row gap-1">
                <b>Quorum</b>
                <select class="bg-1" bind:value={poll.quorum}>
                    <option value={0}>None</option>
                    <option value={60}>Low (60%)</option>
                    <option value={75}>High (75%)</option>
                </select>
            </div>
        </div>
        <div class="panel">
            <div class="row gap-1">
                <button class="row" on:click={save}>
                    <Icon icon={$page.params.id === "new" ? "send" : "save"} />
                    {$page.params.id === "new" ? "Post" : "Post / Edit"}
                </button>
                {#if $page.params.id !== "new"}
                    <button class="row tp red-text" on:click={del}><Icon icon="delete" /> Delete</button>
                {/if}
            </div>
        </div>
    {/if}
</Loading>

<style lang="scss">
    .fields {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px 25px;
    }

    .selection-fields {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 10px 25px;
    }

    .two-cols {
        grid-column: auto / span 2;
    }
</style>
