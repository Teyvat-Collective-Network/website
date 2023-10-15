<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/quickstart#global", "Quickstart"]}>
        <h1>Global Chat</h1>
        <Linkable e="h2" id="what-is-global">What is it?</Linkable>
        <p>
            Global chat is a system that connects channels across the TCN and allows members to chat with each other through it. There are three channels
            available to all servers:
        </p>
        <ul>
            <li><b><code>TCN Public General</code>:</b> A public "general" channel which can be made accessible to all server members.</li>
            <li>
                <b><code>TCN Staff Lounge</code>:</b> The staff general channel which can be made accessible to anyone you would trust with access to your server's
                general staff chat.
            </li>
            <li><b><code>TCN Staff Office</code>:</b> The staff business channel which can be made accessible to your current staff.</li>
        </ul>
        <Linkable e="h2" id="setup">Setup</Linkable>
        <Linkable e="h3" id="adding-the-bot">Adding the bot</Linkable>
        <p>
            First, invite the bot using <A
                to="https://discord.com/api/oauth2/authorize?client_id=905370006362140702&permissions=137976212544&scope=applications.commands%20bot"
                external>this link</A
            >.
        </p>
        <Linkable e="h3" id="permissions">Permissions</Linkable>
        <p>Ensure that the bot has all of the following permissions in all channels you want to connect:</p>
        <ul>
            <li><b>View Channel:</b> This is required for all functionalities.</li>
            <li><b>Read Message History:</b> This is required for fetching older messages to relay purges.</li>
            <li><b>Manage Webhooks:</b> This is required to create webhooks or find your custom webhook to post incoming messages.</li>
            <li><b>Manage Messages:</b> This is required to cross-delete messages that were deleted elsewhere.</li>
        </ul>
        <p>
            Because of the possibility of spam or abusive content that will need to be deleted later on, if you do not allow the bot to delete messages or view
            message history, it will also stop sending them to your channel.
        </p>
        <Callout style="info">
            <p>
                Due to changes in Discord's bot-owned webhook permission system, emoji from other servers won't work by default. To fix this, create a webhook
                manually in the channel. You do not need to do anything else.
            </p>
        </Callout>
        <Linkable e="h3" id="connecting">Connecting</Linkable>
        <Callout style="warn">
            <p>Your global channels will not be able to be used for anything else. All messages sent to the channel are relayed.</p>
        </Callout>
        <p>Once your channel permissions are set up, use <code>/global connect</code> and select the appropriate global channel.</p>
        <p>Run the following steps to ensure the connection works properly:</p>
        <ul>
            <li>Send a message from your side and check another server. If it doesn't show up, you are missing <b>View Channel</b>.</li>
            <li>Send a message from the other side and check that it appears in your channel. If it doesn't show up, <b>Manage Webhooks</b> is missing.</li>
        </ul>
        <p>
            If you are not staff in another TCN server, you can use the global channels in the TCN Hub for this testing &mdash;
            <Mention type="text">tcn-staff-lounge</Mention> and <Mention type="text">tcn-staff-office</Mention>. Also note that if <b>Manage Messages</b> or
            <b>Read Message History</b> is missing, the global bot will ignore your channel entirely.
        </p>
        <Linkable e="h3" id="updating">Updating the Connection</Linkable>
        <ul>
            <li>
                Use <code>/global connection suspend</code> to temporarily pause messages from being relayed in both directions and
                <code>/global connection unsuspend</code> to revert this.
            </li>
            <li>Use <code>/global connection move</code> to move the connection to a different channel without losing your connection settings.</li>
            <li>Use <code>/global connection edit</code> to edit connection settings.</li>
        </ul>
        <Linkable e="h3" id="disconnecting">Disconnecting</Linkable>
        <p>To disconnect your channel, use <code>/global disconnect</code> and the bot will immediately stop relaying messages in both directions.</p>
        <Linkable e="h2" id="moderation">Moderation</Linkable>
        <Linkable e="h3" id="deleting messages">Deleting Messages</Linkable>
        <p>
            When a message or any copy of it is deleted, all copies of it and the original will be deleted. If this isn't working, make sure the bot has the
            required permissions in your channel.
        </p>
        <p>If the deletion didn't work or was incomplete, you can use <code>/global purge message</code> to instruct the bot to retry purging a message.</p>
        <Linkable e="h3" id="banning">Banning</Linkable>
        <p>
            Use <code>/global ban</code> to ban a user from the current global channel. This makes the bot stop relaying messages from that user across all
            servers. The bot will also automatically delete any messages they send in any connected channels. Set <code>local: true</code> to just ban them from
            your instance of the channel. Only global mods may ban globally, but you can submit a ban request using <code>/global request-ban</code>.
        </p>
        <p>To use this command, you must have the <b>Ban Members</b> permission (to local ban) or be a designated global chat mod (to global ban).</p>
        <p>
            Note that the ban is per-channel, so make sure you run it in the right channel. You should not be using this in staff channels unless a staff member
            is causing serious disruption that must be stopped immediately &mdash; instead, reach out to the server's admins or owner and/or an observer.
        </p>
        <p>
            To get the ID of the author of a message, right click the message and select <code>Apps &gt; Get Author ID</code> or run <code>/global author</code>
            with URL of any copy of the message.
        </p>
        <p>
            To unban a user, just use <code>/global unban</code>. Note that bans always supercede unbans, so a locally banned user will not be allowed to use
            your channel and their messages will not be forwarded to you even if they are unbanned globally, and a globally banned user is not exempt in a
            channel in which they are locally unbanned.
        </p>
        <Linkable e="h3" id="panic-mode">Panic Mode</Linkable>
        <Callout style="red">
            <p>
                This command alerts all observers and can only be disabled by an observer. Misuse of this command may result in the loss of global chat
                privileges or other consequences. If you think it might be needed, don't be afraid to use it &mdash; we will discuss with you if we believe it
                was unnecessary, just don't play with it or use it for testing purposes.
            </p>
        </Callout>
        <p>
            If there is a raid or ongoing network-wide incident, you can use <code>/global panic</code> to completely shut down this global channel. It will stop
            relaying messages from all servers but will continue to relay deletions.
        </p>
        <Linkable e="h3" id="for-observers">For Observers</Linkable>
        <ul>
            <li>
                <code>/global channels delete</code> &mdash; Delete a global channel. Do <b>not</b> use this unless the council has agreed to terminate a global
                channel or it was a temporary channel that is no longer needed.
            </li>
            <li><code>/global channels create</code> &mdash; Create a global channel.</li>
            <li><code>/global channels edit</code> &mdash; Edit a global channel.</li>
        </ul>
        <Linkable e="h3" id="other-commands">Other Commands</Linkable>
        <ul>
            <li>
                <code>/global help page:faq</code> &mdash; Show information about the bot. If someone asks what global chat is or why everyone is a bot (fairly
                common), use this command with <code>public: true</code> to show the info page (it will be shown in all servers).
            </li>
            <li>
                <code>/global help page:rules</code> &mdash; Show the global chat rules. Individual server rules still apply and moderation may be done by
                individual servers' staff, but a baseline set of rules exists. Use <code>public: true</code> to show this publicly (it will be shown in all servers).
            </li>
            <li>
                <code>/global nickname</code> &mdash; Set your global nickname. By default, your display name (nickname or username) will be shown to other servers.
                Setting this option will override your display name in all global channels from all servers.
            </li>
        </ul>
    </Navigation>
</div>
