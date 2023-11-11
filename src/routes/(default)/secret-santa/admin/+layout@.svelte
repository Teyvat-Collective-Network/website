<script lang="ts">
    import Layout from "$lib/components/Layout.svelte";
    import Login from "$lib/components/Login.svelte";
    import Redirect from "$lib/components/Redirect.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect="/secret-santa/admin" />
{:else if !$user.observer}
    <Redirect to="/secret-santa" />
{:else}
    <Layout>
        <div class="container">
            <slot />
        </div>
    </Layout>
{/if}
