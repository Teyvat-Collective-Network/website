<script lang="ts">
    import { PUBLIC_DISCORD_ID } from "$env/static/public";
    import A from "$lib/components/A.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
</script>

<div class="container">
    <h1>Add the TCN Bot</h1>
    <p>
        The following permissions are requested. You can remove any or all of them. Please carefully read which permissions are required by which features so
        you can determine which permissions you need to grant.
    </p>
    <ul>
        <li><b>Manage Roles:</b> This is only used by <A to="/info/rolesync" external>rolesync</A>.</li>
        <li><b>Ban Members:</b> This is only used by <A to="/info/banshares" external>banshares</A>.</li>
        <li>
            <b>Manage Webhooks, Embed Links, Use External Emoji:</b> These are only used by <A to="/info/partner-list#autosync" external>partnerlist autosync</A
            >.
        </li>
        <li>
            <b>Read Messages, Send Messages, Send Messages in Threads, Attach Files, Read Message History, Use External Stickers:</b> These are not strictly required
            for anything, but are harmless to grant and future-proof the bot in case features that need them are added later on.
        </li>
    </ul>
    <br />
    <LinkButton to="https://discord.com/api/oauth2/authorize?client_id={PUBLIC_DISCORD_ID}&permissions=413122546692&scope=bot%20applications.commands">
        Add TCN Bot
    </LinkButton>
</div>
