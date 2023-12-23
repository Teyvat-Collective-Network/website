<script lang="ts">
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Redirect from "$lib/components/Redirect.svelte";

    export let data: { link?: string };
</script>

{#if data.link}
    <Redirect to={data.link}></Redirect>
{:else}
    <div class="container">
        <Callout style="red"><p><code>{$page.params.id}</code> is not a valid short link alias.</p></Callout>
        <br />
        <A to="/">return to home</A>
    </div>
{/if}
