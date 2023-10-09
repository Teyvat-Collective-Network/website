<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
    import UserId from "$lib/components/UserId.svelte";
</script>

<div class="container">
    <Navigation last={["/info/constitution", "TCN Constitution"]}>
        <h1>Quickstart</h1>
        <Callout style="info">
            <p>We recommend that you <A to="/add-bot">add the TCN bot</A> to your server. It is not a requirement, but nearly all features depend on it.</p>
        </Callout>
        <Linkable e="h2" id="required">Required</Linkable>
        <Linkable e="h3" id="partner-list">Partner List</Linkable>
        <p>
            You must display the list of TCN servers and other TCN partners in a publicly visible channel, clearly separated from your server's individual
            partners. You can find an up-to-date version in <Mention type="text">partner-list</Mention>, though you do not have to follow this format.
        </p>
        <p>
            For a full list of exact requirements and information on how to enable automatic updating of your partner list, see
            <A to="/info/partner-list">Partner List &amp; Autosync</A>.
        </p>
        <Linkable e="h3" id="partner-event-channel">Partner Event Channel</Linkable>
        <p>
            You must follow <Mention type="text">network-events</Mention> in a publicly visible channel in your server. You can make this the same channel as where
            you post other partner events.
        </p>
        <Callout style="warn">
            <p>The destination channel must be a regular text channel and not an announcement channel itself due to Discord limitations.</p>
        </Callout>
        <Linkable e="h2" id="optional">Optional Features</Linkable>
        <p>
            These features are optional. You may use them to provide better tools for your staff and a better experience for your members, but they are entirely
            optional and you will not be asked why you are not using one of them. Your feedback on what changes can be made to make the features work better for
            you is welcome, but you are not required to give any explanation or feedback.
        </p>
        <Linkable e="h3" id="banshares">Banshares</Linkable>
        <p>
            Banshares are our way of sharing information on problematic users so you can eliminate potential threats or disturbances before they appear in your
            server. You are not required to ban users who have been banshared &mdash; the purpose is simply to provide you with information for you to use as
            you see fit.
        </p>
        <p>To submit a banshare, visit the <A to="/banshare">banshare form</A>.</p>
        <p>To learn how to set up banshares and how to use the form, see <A to="/info/banshares">Banshares</A>.</p>
        <Linkable e="h3" id="global">Global Chat</Linkable>
        <p>
            Global chat is a feature available to all TCN servers that allows members to chat with members from other servers. There is a global channel
            available to connect for all of your members and two channels for staff. All of these are optional, and you may use all, some, or none of them.
        </p>
        <p>
            To learn how to set up global chat, how to operate it, important things to know, how to moderate across it, and how to use it for your own events
            and other purposes, see <A to="/info/global">Global Chat</A>.
        </p>
        <Linkable e="h3" id="staff-link">Staff Link</Linkable>
        <p>
            You can register your staff in the API (which gives them the role in the TCN Hub and allows them to publish banshares) using <code>/staff add</code>
            on the TCN bot. You can link roles to automatically add and remove staff when their roles change in your server.
        </p>
        <p>To learn how to use this feature and how to restrict which staff can publish banshares, see <A to="/info/staff-link">Staff Link</A>.</p>
        <Linkable e="h3" id="other-bots">Other Bots</Linkable>
        <p>
            We have several other bots either officially or unofficially available for you that may interest you. Check out how to use them
            <A to="/info/other-bots">here</A>. Here is a list:
        </p>
        <Callout style="info">
            <p>These bots are not TCN-exclusive. Feel free to use them in your other servers!</p>
        </Callout>
        <ul>
            <li>
                <b>Genshin Wizard</b> [<Mention><UserId id="188109365671100416" /></Mention>] <span class="text-accent">Official Partner</span> &mdash; A Genshin
                Impact utility Discord bot.
            </li>
            <li>
                <b>Daedalus</b> [<Mention><UserId id="251082987360223233" /></Mention>] &mdash; A general-purpose Discord bot.
            </li>
        </ul>
    </Navigation>
</div>
