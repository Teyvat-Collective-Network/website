<script lang="ts">
    import Badge from "./Badge.svelte";

    export let context: { owner: boolean; advisor: boolean; voter: boolean; council: boolean; staff: boolean };
</script>

{#if context.owner}<Badge icon="badge">Server Owner</Badge>{/if}
{#if context.advisor}<Badge icon="partner_exchange">Council Advisor</Badge>{/if}
{#if context.voter}<Badge icon="how_to_vote">Voter</Badge>{/if}
{#if context.council}<Badge icon="groups">Council Member</Badge>{/if}
{#if context.staff}<Badge icon="verified_user">Network Staff</Badge>{/if}
