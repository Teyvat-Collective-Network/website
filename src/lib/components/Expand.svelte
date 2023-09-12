<script lang="ts">
    import Icon from "./Icon.svelte";

    export let open: boolean;
</script>

<button class="tp text-accent" on:click={() => (open = !open)}>
    <Icon icon={open ? "expand_more" : "chevron_right"} />
</button>
