<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/quickstart", "Quickstart"]}>
        <h1>Discord Help</h1>
        <Linkable e="h2" id="permissions">Discord Permissions</Linkable>
        <p>
            If you have absolutely no knowledge on Discord permissions, a good place to start would be the official
            <A to="https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ" external>Permissions FAQ</A> support article.
        </p>
        <Callout style="info">
            <p>
                An important thing to know about permissions is that positive role overrides always apply over negative role overrides regardless of hierarchy.
            </p>
        </Callout>
        <ul>
            <li>List of all permissions and what they do: <A to="/info/discord/permission-list">Permission List</A></li>
            <li>More information and recommendations for good structure: <A to="/info/discord/permissions">Permissions</A></li>
        </ul>
        <Linkable e="h2" id="webhooks-embeds">Webhooks &amp; Embeds</Linkable>
        <p>
            This is a guide on how to use embeds and webhooks in Discord. This guide features <A to="https://discohook.org" external>Discohook</A> and
            <A to="https://message.style">Embed Generator</A>.
        </p>
        <p>Webhooks are resources that you can create in a text channel that anyone with the URL can use to post messages to the channel.</p>
        <p>Embeds are a way to organize information and add styling to your resources.</p>
        <p>To view the full guide, visit the <A to="/info/discord/webhooks">webhooks</A> or <A to="/info/discord/embeds">embeds</A> page.</p>
    </Navigation>
</div>
