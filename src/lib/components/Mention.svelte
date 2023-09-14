<script lang="ts" context="module">
    const icons = {
        user: "alternate_email",
        text: "tag",
    };
</script>

<script lang="ts">
    import Icon from "./Icon.svelte";

    export let type: keyof typeof icons | "none" = "user";

    let other_classes = "";
    export { other_classes as class };
</script>

{#if type === "none"}
    <span {...$$props} class="mention {other_classes}"><slot /></span>
{:else}
    <span {...$$props} class="mention with-icon {other_classes}"><Icon icon={icons[type]} /> <slot /></span>
{/if}
