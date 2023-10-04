<script lang="ts">
    import { page } from "$app/stores";
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { token, user } from "$lib/stores";
    import type { TCNDoc } from "$lib/types";
    import { highlight, withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    const { doc, parsed } = $page.data as unknown as { doc: TCNDoc; parsed: string | null };
    const offset = new Date().getTimezoneOffset();

    async function setOfficial(official: boolean) {
        try {
            await withAudit(
                `Are you sure you want to ${official ? "set this document as officially endorsed" : "remove this document's official designation"}?`,
                async (reason) => {
                    await api($token, `PATCH /docs/${doc.id}/official`, { official }, reason);
                    doc.official = official;
                },
                false,
            );
        } catch (error) {
            alert(error);
        }
    }

    async function del() {
        if (doc.author === $user?.id) {
            if (!confirm("Are you sure you want to delete this document? It will become visible to only you an observers. You can undo this at any time."))
                return;
            try {
                await api($token, `PATCH /docs/${doc.id}`, { deleted: true });
                doc.deleted = true;
            } catch (error) {
                alert(error);
            }
        } else {
            try {
                await withAudit(
                    "Are you sure you want to delete this document? It will become visible to only the author and observers. Only the author can undo this.",
                    async (reason) => {
                        await api($token, `DELETE /docs/${doc.id}`, undefined, reason);
                        doc.deleted = true;
                    },
                    true,
                );
            } catch (error) {
                alert(error);
            }
        }
    }

    async function undelete() {
        if (!confirm("Are you sure you want to undelete this document? It will become visible as per its visibility rules. You can undo this at any time."))
            return;

        try {
            await api($token, `PATCH /docs/${doc.id}`, { deleted: false });
            doc.deleted = false;
        } catch (error) {
            alert(error);
        }
    }

    onMount(() => highlight());
</script>

{#if doc.official}
    <Callout style="info">
        <p>
            This is an official document as designated by the observer team.
            {#if $user?.observer}
                <A on:click={() => setOfficial(false)}>[remove designation]</A>
            {/if}
        </p>
    </Callout>
    <br />
{:else if $user?.observer}
    <p><A on:click={() => setOfficial(true)}>[designate as official]</A></p>
{/if}
{#if doc.deleted}
    <Callout style="red">
        <p>This document is deleted and only visible to {doc.author === $user?.id ? "you" : "the author"} and observers.</p>
    </Callout>
{:else if doc.allowEveryone}
    <Callout style="info">
        <p>This document is publicly visible.</p>
    </Callout>
{:else if doc.allowLoggedIn}
    <Callout style="info">
        <p>This document is visible to all users who are signed in.</p>
    </Callout>
{:else if doc.allowCouncil}
    <Callout style="warn">
        <p>This document is only visible to TCN Council Members.</p>
    </Callout>
{:else}
    <Callout style="red">
        <p>This document is only visible to the author, observers, and individually authorized users.</p>
    </Callout>
{/if}
<h2 class="short row gap-2">
    {doc.title}
    {#if doc.author === $user?.id}
        <A to="/docs/edit/{doc.id}"><Icon icon="edit" /></A>
    {/if}
    {#if doc.deleted}
        {#if doc.author === $user?.id}
            <A class="red-text" on:click={undelete}><Icon icon="restore_from_trash" /></A>
        {/if}
    {:else if doc.author === $user?.id || $user?.observer}
        <A class="red-text" on:click={del}><Icon icon="delete" /></A>
    {/if}
</h2>
{#if doc.anon && !$user?.observer && doc.author !== $user?.id}
    <p>Author: anonymous</p>
{:else}
    <p class="row gap-1">
        Author: <b><UserMention id={doc.author} /></b>
        {#if doc.anon}&nbsp;anonymously{/if}
    </p>
    <p>
        Times are displayed in your detected timezone, <b>{Intl.DateTimeFormat().resolvedOptions().timeZone}</b> (UTC{offset === 0
            ? ""
            : `${offset > 0 ? "-" : "+"}${Math.floor(Math.abs(offset) / 60)}:${(Math.abs(offset) % 60).toString().padStart(2, "0")}`})
    </p>
    <hr />
{/if}
{#if parsed === null}
    <Callout style="red">
        <p>
            The document could not be rendered into Markdown. If this issue persists, please contact a developer. The raw source code has been displayed below.
        </p>
    </Callout>
    <pre>{doc.body}</pre>
{:else}
    {@html parsed}
{/if}
