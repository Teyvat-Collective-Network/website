<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Link from "$lib/components/Link.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { user } from "$lib/stores";

    const { isNew, event } = $page.data;

    beforeNavigate(({ cancel }) => confirm("Are you sure you want to leave this page? You will lose any unsaved changes.") || cancel());
</script>

<div class="container">
    {#if $user?.id !== event.owner}
        <Callout style="info">
            <p>You are editing <Link to="/user/{event.owner}" external><b><UserId id={event.owner} /></b></Link>'s event.</p>
        </Callout>
        <br />
    {/if}

    <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px 25px">
        <label for="title"><b>Title</b></label>
        <input id="title" type="text" bind:value={event.title} />
        <label for="start"><b>Start</b></label>
        <input
            id="start"
            type="datetime-local"
            value={((d) =>
                `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T${d
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`)(new Date(event.start))}
        />
        <label for="body"><b>Body</b></label>
        <Textarea id="body" bind:value={event.body} />
    </div>
</div>
