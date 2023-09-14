<script lang="ts">
    import { listJoin } from "$lib/utils";
    import Linkable from "./Linkable.svelte";
    import Show from "./Show.svelte";

    export let name: string;
    export let code: string = name.toUpperCase().replaceAll(/\s+/g, "_");
    export let bit: number;
    export let open: boolean;

    export let T = false;
    export let V = false;
    export let S = false;
    export let MFA = false;
    export let H = false;
</script>

<div>
    <Linkable e="h5" id={code} class="row gap-1">
        <span>{@html name} (<code>{code}</code>)</span>
        <Show when={open}>
            &mdash; <code>1 &lt;&lt; {bit} = {2 ** bit}</code>
        </Show>
    </Linkable>
    <Show when={open}>
        <b class="text-2">
            {#if T || V || S}
                This permission can be set server-wide or in {listJoin([T && "text", V && "voice", S && "stage"].filter((x) => x))} channels.
            {:else}
                This permission can be set server-wide.
            {/if}
            {#if MFA}
                If the 2FA requirement for moderation is enabled in the server, users must have 2FA enabled on their account to take actions requiring this
                permission.
            {/if}
            {#if H}
                This permission is subject to role hierarchy.
            {/if}
        </b>
    </Show>
</div>

<style lang="scss">
    b {
        font-weight: 400;
    }
</style>
