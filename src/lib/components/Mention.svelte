<script lang="ts" context="module">
    const icons = {
        user: "alternate_email",
        text: "tag",
    };
</script>

<script lang="ts">
    import Icon from "./Icon.svelte";

    export let id: string = "";
    export let type: keyof typeof icons | "none" = "user";

    let other_classes = "";
    export { other_classes as class };
</script>

<span {...$$restProps} data-id={id} class="mention {type === 'none' ? '' : 'with-icon'} {other_classes}">
    {#if type !== "none"}<Icon icon={icons[type]} />{/if}
    <slot />
</span>
