<script lang="ts">
    import Callout from "$lib/components/Callout.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
</script>

<div class="container">
    <h1>Exit Procedure</h1>
    <p>
        This is a list of things to do and keep in mind if you are leaving the TCN, whatever the reason may be. This is essentially the inverse of the
        quickstart guide. Don't hesitate to reach out to an observer if you need any assistance, even once you've been removed from HQ.
    </p>
    <Linkable e="h2" id="motivation">Motivation</Linkable>
    <p>
        It is good for all parties involved to ensure no confusion about the relationships between the parties. Therefore, once you are no longer a member of
        the TCN, it is beneficial for both the network and your server that people do not think you are still affiliated.
    </p>
    <p>
        We will make an announcement in the TCN Hub that you are no longer in the TCN (a reason will usually not be given unless you wish for us to provide one)
        and you may choose to do so as well in your server. Most crucially, you should remove identifying features such as the partner list.
    </p>
    <Linkable e="h2" id="teardown">Teardown</Linkable>
    <ul>
        <li>
            Delete the TCN partner list (if you are using autosync, use <code>/partnerlist remove</code>), and if it is in its own TCN partner channel, delete
            or archive the channel.
        </li>
        <li>
            Unfollow <Mention type="text">network-events</Mention>. Note that if you hold an event in collaboration with a TCN server, you are still allowed to
            have your event promoted through this channel.
        </li>
        <li>
            Invoke <code>/disconnect</code> in your global channels. You do not need to delete them, but you should archive them for clarity if not. You can
            then kick <Mention><UserId id="1145438790907871322" /></Mention> as it will no longer serve any purpose.
        </li>
        <li>
            Kick <Mention><UserId id="959360773518413824" /></Mention>. Staff autosync will stop working once your server is formally removed and your server's
            dedicated role will be removed. Banshares will no longer be forwarded.
        </li>
    </ul>
    <p>
        You do not need to remove the other bots mentioned in the quickstart as they are not TCN-exclusive. The TCN-exclusive bots will stop working once your
        server is no longer in the TCN, so there is no point in keeping them around.
    </p>
    <Callout style="info">
        <p>
            If you are using global chat in a collaboration with another TCN server, you may keep it, as we allow global chat to be used by TCN servers with
            non-TCN servers connected. Your connection to the general channels will stop working.
        </p>
    </Callout>
</div>
