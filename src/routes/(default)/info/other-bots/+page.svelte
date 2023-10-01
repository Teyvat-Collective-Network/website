<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
    import UserId from "$lib/components/UserId.svelte";
</script>

<div class="container">
    <Navigation last={["/info/quickstart#other-bots", "Quickstart"]}>
        <h1>Other Bots</h1>
        <Callout style="info">
            <p>These bots are not TCN-exclusive. Feel free to use them in your other servers!</p>
        </Callout>
        <Linkable e="h2" id="genshin-wizard">Genshin Wizard</Linkable>
        <h5 class="text-accent">[Official Partner]</h5>
        <p>Developed by <Mention><UserId id="188109365671100416" /></Mention></p>
        <p><A to="https://genshinwizard.com" external>Genshin Wizard Website</A></p>
        <p>
            The TCN is officially partnered with Genshin Wizard, a multi-purpose Genshin Impact bot with a comprehensive set of features allowing you to view
            your in-game stats, flex your builds, view build guides and hundreds of high-quality infographics, etc. To get more information or for setup, please
            contact the support team on their <A to="https://discord.gg/BTT5Zr7Dmp" external>Discord server</A> and open a ticket. Mention that you are part of the
            TCN and would like help setting up.
        </p>
        <Callout style="info">
            <p>
                This bot is not developed by a TCN Council Member. It is just a partner of the TCN and is not exclusive to us and frequently partners with other
                servers.
            </p>
        </Callout>
        <Linkable e="h2" id="daedalus">Daedalus</Linkable>
        <p>Developed by <Mention><UserId id="251082987360223233" /></Mention></p>
        <p>
            Daedalus is a modern, general-purpose bot containing a wide array of features for all of your server management needs. It features full
            slash-command support, buttons and dropdowns for a smooth experience, modals, high customizability, transparent permissions, etc.
        </p>
        <p><A to="/info/other-bots/daedalus">See More</A></p>
    </Navigation>
</div>
