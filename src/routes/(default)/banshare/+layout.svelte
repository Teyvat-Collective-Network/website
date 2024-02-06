<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import { user } from "$lib/stores";
</script>

{#if $user}
    {#if $user?.council || Object.values($user?.guilds ?? {}).some((x) => x.staff)}
        <slot />
    {:else}
        <div class="container">
            <Callout style="red">
                <p>
                    You do not have permission to submit banshares from any TCN servers. If you believe this is a mistake, please contact your server's owner or
                    a <A to="/contact">TCN observer</A>.
                </p>
            </Callout>
            <br />
            <LoggedInAs />
        </div>
    {/if}
{:else}
    <div class="container">
        <div class="panel">
            Please <A to="/login?redirect=/banshare">log in</A> to submit a banshare.
        </div>
    </div>
{/if}
