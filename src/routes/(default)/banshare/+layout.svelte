<script lang="ts">
    import Callout from "$lib/components/Callout.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import Login from "$lib/components/Login.svelte";
    import { user } from "$lib/stores";
</script>

{#if !$user}
    <Login redirect="/banshare" />
{:else}
    <div class="container">
        <h2>Banshare Form</h2>
        <LoggedInAs />
        {#if Object.values($user.guilds).some(({ owner, advisor, staff, roles }) => owner || advisor || (staff && roles.includes("banshares")))}
            <slot />
        {:else}
            <Callout style="red">
                <p>
                    You do not have permission to submit banshares from any TCN servers. If you believe this is a mistake, please contact your server's owner or
                    a TCN observer.
                </p>
            </Callout>
        {/if}
    </div>
{/if}
