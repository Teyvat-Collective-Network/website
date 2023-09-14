<script lang="ts">
    import { user } from "$lib/stores";
    import type { CalendarEvent } from "$lib/types";
    import A from "./A.svelte";
    import Callout from "./Callout.svelte";
    import Icon from "./Icon.svelte";
    import Invite from "./Invite.svelte";
    import Modal from "./Modal.svelte";

    export let event: CalendarEvent;
    export let open: boolean;
</script>

<Modal bind:open on:close background_color="rgb(var(--bg-1))" overlay_color="rgb(var(--pure-rgb), 80%)">
    <h2 class="row gap-1">
        {event.title}
        {#if $user?.observer || $user?.id === event.owner}
            <A to="/calendar/edit/{event.id}"><Icon icon="edit" /></A>
        {/if}
    </h2>

    {#if event.body === ""}
        <Callout style="red"><p>Rendering markdown failed.</p></Callout>
        <br />
    {:else}
        {@html event.body}
    {/if}

    {#if event.invites.length > 0}
        <div class="row no-center gap-1">
            {#each event.invites as invite}
                <Invite {invite} />
            {/each}
        </div>
    {/if}
</Modal>
