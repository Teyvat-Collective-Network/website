<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Colorpicker from "$lib/components/Colorpicker.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Show from "$lib/components/Show.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { alerts, token, user } from "$lib/stores";
    import type { TCNDoc } from "$lib/types";
    import { onMount } from "svelte";

    const { save: saveStore } = alerts;

    let doc: TCNDoc;
    let failed: boolean, done: boolean;

    onMount(async () => {
        if ($page.params.id === "new")
            doc = {
                id: "",
                official: false,
                deleted: false,
                author: $user!.id,
                anon: false,
                allowCouncil: false,
                allowEveryone: false,
                allowLoggedIn: false,
                allowlist: [],
                title: "",
                body: "",
                embedTitle: "",
                embedBody: "",
                embedColor: 0,
                embedImage: "",
                embedThumbnail: false,
            };
        else
            try {
                doc = await api($token, `GET /docs/${$page.params.id}`);
            } catch (error) {
                alert(error);
                failed = true;
            }

        done = true;
    });

    const open = { content: true, body: true, access: true, allowlist: true, appearance: true, embed: true };
    const tags: Record<string, string | null> = {};

    async function addReader() {
        const id = prompt("Enter the ID of the user to which to grant access.");
        if (!id) return;
        if (!id.match(/^[1-9][0-9]{16,19}$/)) return alert("Valid Discord IDs are 17-20 digit numbers.");
        if (doc.allowlist.includes(id)) return alert("That user already has access.");
        if (id === $user!.id) return alert("You do not need to give yourself access.");

        doc.allowlist = [...doc.allowlist, id];
    }

    async function save() {
        doc.embedTitle ||= doc.title;
        doc.embedBody ||= doc.allowEveryone ? `Author: @${$user!.tag}` : "Sign in to view this document.";

        const data = { ...doc, id: undefined, author: undefined };

        try {
            if ($page.params.id === "new") {
                const { id } = await api($token, `POST /docs`, data);

                leave = true;
                goto(`/docs/edit/${id}`);
            } else {
                await api($token, `PATCH /docs/${$page.params.id}`, data);
                saveStore.update((x) => x + 1);
                setTimeout(() => saveStore.update((x) => x - 1), 1500);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function del(deleted: boolean) {
        if (
            !confirm(
                `Are you sure you want to ${deleted ? "delete" : "undelete"} this document? It will ${
                    deleted ? "no longer be visible except to you and observers" : "become visible as per its visibility rules"
                }. You can undo this at any time. Any unsaved changes will be saved as well.`,
            )
        )
            return;

        doc.deleted = deleted;
        await save();
    }

    let leave = false;
    beforeNavigate(({ cancel }) => leave || confirm("Are you sure you want to leave this page? Any unsaved work will be lost.") || cancel());
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.ctrlKey && e.key === "s") {
            save();
            e.preventDefault();
            e.stopPropagation();
        }
    }}
/>

<A to="/docs">Docs Home</A>
<br /><br />
<Loading {done}>
    {#if failed}
        <Callout style="red">
            <p>This document does not exist.</p>
        </Callout>
    {:else if doc.author !== $user?.id}
        <Callout style="red">
            <p>Only the author may edit a document.</p>
        </Callout>
    {:else}
        {#if doc.deleted}
            <Callout style="red">
                <p>This document is deleted. Only you and observers are able to view it. You can restore it at any time at the bottom of this page.</p>
            </Callout>
            <br />
        {/if}
        <div class="panel">
            <h3 class="short row flex-space">
                Document Content
                <A class="row" on:click={() => (open.content = !open.content)}><Icon icon={open.content ? "expand_less" : "expand_more"} /></A>
            </h3>
            <Show when={open.content}>
                <h4 class="short">Title</h4>
                <input type="text" class="bg-1" required maxlength={256} bind:value={doc.title} />
                <h4 class="short row flex-space">
                    Body
                    <A class="row" on:click={() => (open.body = !open.body)}><Icon icon={open.body ? "expand_less" : "expand_more"} /></A>
                </h4>
                <Show when={open.body}>
                    <Textarea class="bg-1" rows={8} required maxlength={16384} bind:value={doc.body} />
                </Show>
            </Show>
        </div>
        <div class="panel">
            <h3 class="short row flex-space">
                Access
                <A class="row" on:click={() => (open.access = !open.access)}><Icon icon={open.access ? "expand_less" : "expand_more"} /></A>
            </h3>
            <Show when={open.access}>
                <p>
                    Control view access here. Only you can edit this document and edit permissions. Only you and observers can delete this document. Observers
                    always have view access.
                </p>
                <label>
                    <input type="checkbox" class="bg-1" bind:checked={doc.allowCouncil} />
                    Allow TCN Council Members
                </label>
                <label>
                    <input type="checkbox" class="bg-1" bind:checked={doc.allowLoggedIn} />
                    Allow all users who are logged in
                </label>
                <label>
                    <input type="checkbox" class="bg-1" bind:checked={doc.allowEveryone} />
                    Make this document fully public
                </label>
                <h4 class="short row flex-space">
                    Allowlist
                    <A class="row" on:click={() => (open.allowlist = !open.allowlist)}><Icon icon={open.allowlist ? "expand_less" : "expand_more"} /></A>
                </h4>
                <Show when={open.allowlist}>
                    <div class="col no-center gap-1">
                        {#each doc.allowlist as id}
                            <div class="row gap-1">
                                <A
                                    class="row red-text"
                                    on:click={() => confirm(`Remove access for ${tags[id] ?? id}?`) && (doc.allowlist = doc.allowlist.filter((x) => x !== id))}
                                >
                                    <Icon icon="delete" />
                                </A>
                                <span><code>{id}</code></span> &mdash; <Mention {id}><UserId {id} bind:tag={tags[id]} /></Mention>
                            </div>
                        {/each}
                        <A class="row gap-1" on:click={addReader}><Icon icon="add" /> Add User</A>
                    </div>
                </Show>
            </Show>
        </div>
        <div class="panel">
            <h3 class="short row flex-space">
                Appearance
                <A class="row" on:click={() => (open.appearance = !open.appearance)}><Icon icon={open.appearance ? "expand_less" : "expand_more"} /></A>
            </h3>
            <Show when={open.appearance}>
                <label>
                    <input type="checkbox" class="bg-1" bind:checked={doc.anon} />
                    Anonymous (observers will always be able to see your name)
                </label>
                {#if $user?.observer}
                    <label>
                        <input type="checkbox" class="bg-1" bind:checked={doc.official} />
                        Official (use this responsibly &mdash; observer-only)
                    </label>
                {/if}
                <h4 class="short row flex-space">
                    Embed Data
                    <A class="row" on:click={() => (open.embed = !open.embed)}><Icon icon={open.embed ? "expand_less" : "expand_more"} /></A>
                </h4>
                <Show when={open.embed}>
                    <p>This controls the appearance of the embed that appears when you paste your document link into Discord.</p>
                    <h6 class="short">Embed Title</h6>
                    <input type="text" class="bg-1" placeholder={doc.title} maxlength={256} bind:value={doc.embedTitle} />
                    <h6 class="short">Embed Body</h6>
                    <Textarea
                        class="bg-1"
                        placeholder={doc.allowEveryone ? `Author: @${$user.tag}` : "Sign in to view this document."}
                        maxlength={4096}
                        bind:value={doc.embedBody}
                    />
                    <h6 class="short">Embed Color</h6>
                    <Colorpicker bind:color={doc.embedColor} />
                    <h6 class="short">Embed Image</h6>
                    <input type="text" class="bg-1" maxlength={1024} bind:value={doc.embedImage} />
                    <br /><br />
                    <Modal button={true}>
                        <span slot="button">Preview</span>
                        <img src={doc.embedImage} alt="Failed to load" />
                    </Modal>
                    <br />
                    <label>
                        <input type="checkbox" class="bg-1" bind:checked={doc.embedThumbnail} />
                        Show image as thumbnail instead of large image
                    </label>
                </Show>
            </Show>
        </div>
        {#if doc.official && !$user?.observer}
            <Callout style="info">
                <p>This document is currently marked as official. Editing it will remove this and you will need to ask an observer to mark it again.</p>
            </Callout>
            <br />
        {/if}
        <div class="panel">
            <div class="row gap-1">
                <button class="row" on:click={save}><Icon icon="save" /> Save</button>
                {#if $page.params.id !== "new"}
                    <button class="row tp red-text" on:click={() => del(!doc.deleted)}>
                        <Icon icon={doc.deleted ? "restore_from_trash" : "delete"} />
                        {doc.deleted ? "Restore" : "Delete"}
                    </button>
                    <A class="row gap-1" to="/docs/{$page.params.id}"><Icon icon="visibility" /> View</A>
                {/if}
            </div>
        </div>
    {/if}
</Loading>
