<script lang="ts">
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Layout from "$lib/components/Layout.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import type { TCNDoc } from "$lib/types";

    const { doc, fail } = $page.data as unknown as { doc: TCNDoc; fail: boolean };

    const props = fail ? {} : { title: doc.embedTitle, body: doc.embedBody, color: doc.embedColor, image: doc.embedImage, thumbnail: doc.embedThumbnail };
</script>

<Layout {...props}>
    <div class="container">
        {#if fail}
            <Callout style="red">
                <p>This document does not exist or was deleted.</p>
            </Callout>
        {:else if !doc.id}
            <Callout style="red">
                <p>You are not authorized to view this document.</p>
            </Callout>
            <br />
            <LoggedInAs message="" />
        {:else}
            <slot />
        {/if}
    </div>
</Layout>
