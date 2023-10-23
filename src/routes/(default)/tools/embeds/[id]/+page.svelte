<script lang="ts">
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
</script>

<div class="container">
    <Callout style="red"><p><code>{$page.params.id}</code> is not a valid share link. It may have expired.</p></Callout>
    <br />
    <A to="/tools/embeds">go to embed tool</A>
</div>
