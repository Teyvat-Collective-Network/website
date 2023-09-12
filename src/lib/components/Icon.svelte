<script lang="ts">
    export let icon: string;

    let other_classes: string = "";
    export { other_classes as class };
</script>

<span {...$$props} class="material-symbols-outlined {other_classes}">{icon}</span>
