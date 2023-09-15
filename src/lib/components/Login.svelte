<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import Redirect from "./Redirect.svelte";

    export let redirect: string;
</script>

<Redirect to="/login?redirect={encodeURIComponent(`${PUBLIC_DOMAIN}${redirect}`)}" />
