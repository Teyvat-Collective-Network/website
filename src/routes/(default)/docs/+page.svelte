<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { token } from "$lib/stores";
    import type { TCNDoc } from "$lib/types";
    import { onMount } from "svelte";

    let docs: TCNDoc[];

    onMount(async () => {
        docs = await api($token, `GET /docs`).catch(alert);
    });
</script>

<h1>TCN Documents</h1>
<p>
    TCN Documents are available to TCN council members, allowing them to create markdown documents with support for many Discord features such as mentioning
    users.
</p>
<h3>Your Documents</h3>
<Loading done={docs}>
    <ul>
        {#each docs as doc}
            <li><A to="/docs/{doc.id}">{doc.title}</A></li>
        {/each}
    </ul>
    <A class="row gap-1" to="/docs/edit/new"><Icon icon="add" /> New Document</A>
</Loading>
