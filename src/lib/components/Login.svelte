<script lang="ts">
    import Redirect from "./Redirect.svelte";

    export let redirect: string;
</script>

<Redirect to="/login?redirect={encodeURIComponent(redirect)}" />
