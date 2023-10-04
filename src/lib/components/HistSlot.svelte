<script lang="ts">
    export let label: string;
</script>

<span class="row gap-1">
    <span class="text-2" id="inner">{label}</span>
    <slot />
</span>

<style lang="scss">
    span#inner {
        font-size: 75%;
        text-transform: uppercase;
    }
</style>
