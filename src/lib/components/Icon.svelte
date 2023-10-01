<script lang="ts">
    export let icon: string;

    let other_classes: string = "";
    export { other_classes as class };
</script>

<span {...$$restProps} class="material-symbols-outlined {other_classes}">{icon}</span>
