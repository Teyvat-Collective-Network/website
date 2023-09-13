<script lang="ts">
    export let when: any;
</script>

<div id="content" style={when ? "" : "display: none"}>
    <slot />
</div>
