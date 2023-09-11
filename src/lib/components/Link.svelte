<script lang="ts">
    export let to: string;
    export let external: boolean = false;
</script>

<a href={to} {...external ? { target: "_blank", rel: "noreferrer" } : {}}><slot /></a>
