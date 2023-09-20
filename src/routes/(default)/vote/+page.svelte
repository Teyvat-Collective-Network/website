<script lang="ts">
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { user } from "$lib/stores";
</script>

<div class="container">
    <h2>Voting Center</h2>
    {#if $user?.observer}
        <div class="row gap-1">
            <LinkButton to="/vote/edit/new">Create Vote</LinkButton>
            <LinkButton to="/vote/activity-check">Voting Records</LinkButton>
        </div>
    {/if}
</div>
