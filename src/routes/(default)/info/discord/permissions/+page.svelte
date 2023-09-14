<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Carousel from "$lib/components/Carousel.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/discord#permissions", "Discord Help"]}>
        <h1>Permissions</h1>
        <Linkable e="h2" id="introduction">Introduction</Linkable>
        <p>
            Permissions are the way you control what users are able and not able to do on your server. Managing permissions correctly is extremely important to
            prevent abuse while giving your members an optimal experience.
        </p>
        <p>
            However, it can be difficult to manage them correctly, and even small exploits that do not cause major issues can still make the server appear
            disorganized and poorly operated.
        </p>
        <p>
            In this guide, we explain the details behind how permissions interact and are calculated. Additionally, there are often multiple ways to technically
            obtain the same effect, but some are much harder to maintain and can cause restrictions later on, so we give recommendations for how you may want to
            set things up.
        </p>
        <Linkable e="h2" id="mechanics">Mechanics</Linkable>
        <p>
            Certain actions like deleting messages apply in a specific channel, and the permissions that allow those can be set at a channel level. Categories
            can have these permissions set, but they do not actually give the permissions in their child channels, it just determines what overrides new
            channels in the category have, and synced channels (children with the exact same overrides) will be updated when the category's overrides are
            edited.
        </p>
        <p>The priority order of permissions and overrides is as follows:</p>
        <ul>
            <li>
                If the user is the owner or has a role with the <A to="/info/discord/permission-list#ADMINISTRATOR" external>Administrator</A> permission, they are
                allowed.
            </li>
            <li>
                If the user is timed out or has not passed membership screening and the permission is not
                <A to="/info/discord/permission-list#VIEW_CHANNEL" external>View Channel</A> or
                <A to="/info/discord/permission-list#READ_MESSAGE_HISTORY" external>Read Message History</A>, they are denied.
            </li>
            <li>If the user has a user-level override, it applies.<sup>&dagger;</sup></li>
            <li>If the user has a role that has a role-level override allowing that permission, they are allowed.<sup>&dagger;</sup></li>
            <li>If the user has a role that has a role-level override denying that permission, they are denied.<sup>&dagger;</sup></li>
            <li>If there is an <Mention>everyone</Mention>-level override, it applies<sup>&dagger;</sup></li>
            <li>If the user has a role that has the permission granted server-wide (including <Mention>everyone</Mention>), they are allowed.</li>
            <li>If all fail, they are denied.</li>
        </ul>
        <p>
            <sup>&dagger;</sup> If the permission is only applicable server-wide (e.g. <A to="/info/discord/permission-list#BAN_MEMBERS" external>Ban Users</A
            >), this does not apply.
        </p>
        <Callout style="red">
            <p>
                Positive role-level overrides <b>always</b> take priority over negative ones. Role hierarchy does <b>not</b> matter here. If you give
                <A to="/info/discord/permission-list#SEND_MESSAGES" external>Send Messages</A> to a channel access role, your mute role will not work anymore. See
                the
                <A to="#how-to">How To</A> section for guides on common permission patterns and how to avoid this pitfall.
            </p>
        </Callout>
        <br />
        <Callout style="info">
            <p>Some permissions are dependent on other permissions. For example, a user cannot send a message to a channel they cannot view.</p>
        </Callout>
        <Linkable e="h2" id="how-to">How To</Linkable>
        <Linkable e="h3" id="introduction">Introduction</Linkable>
        <p>
            Due to the way permissions are calculated (allow role-level overrides always overrule deny role-level overrides regardless of hierarchy), you want
            to grant as few allow overrides as possible. Note that allow <Mention>everyone</Mention>-level overrides are not an issue as role-level overrides
            take priority.
        </p>
        <p>
            In the following sections, we cover many common patterns, the best way to set them up to optimize maintainability, and common pitfalls to watch out
            for.
        </p>
        <Linkable e="h3" id="verification-role">How do I set up a verification role?</Linkable>
        <p>
            Most servers have a role that is granted by clicking on the verification prompt to confirm that they have read the rules (as a weak filter against
            bots). Typically, channels are only visible to verified users except landing channels. Giving the verified role allow overrides will prevent you
            from denying them on other roles, so be careful with overrides.
        </p>
        <Callout style="info">
            <p>
                Before you set one up, consider using Discord's built-in member verification. This is stronger than verification roles, as a user who has not
                passed membership screening cannot DM server members. It automatically disables all interaction, including clicking buttons or adding to
                existing reactions. Verification roles are already a weak filter against bots, and allowing <Mention class="bg-2">everyone</Mention> to see all public
                channels does not actually create any tangible threat.
            </p>
        </Callout>
        <p>
            If you've decided to do this anyway, the best way to set it up is to deny <Mention>everyone</Mention> and grant your verification role View Channel at
            a base level. All channels are now automatically visible only to verified users. Then, just allow <Mention>everyone</Mention> permission to see your
            landing channels via overrides (remember that allow <Mention>everyone</Mention>-level overrides are not an issue).
        </p>
        <Modal button>
            <span slot="button" class="row gap-1"><Icon icon="image" /> Show Images</span>
            <div class="row gap-1">
                <Image src="https://i.imgur.com/VnnTrfc.png" alt="everyone permission" />
                <Image src="https://i.imgur.com/x3yJTJ1.png" alt="verified permission" />
                <Image src="https://i.imgur.com/ZacXV9M.png" alt="everyone overrides" />
            </div>
        </Modal>
        <p>
            In addition to not using unnecessary allow overrides, this is actually easier as you will only need to set up overrides on your landing channels. A
            common way to do this is to use a deny <Mention>everyone</Mention>-level and allow role-level override on all non-landing channels, which is not
            only harder but also introduces allow role-level overrides.
        </p>
        <p>
            If you want a public channel that <Mention>everyone</Mention> can see but only verified users can send messages in, just disable
            <A to="/info/discord/permission-list#SEND_MESSAGES" external>Send Messages</A> for <Mention>everyone</Mention> and enable it for the verified role. If
            you then need a channel that <Mention>everyone</Mention> can send messages in, just enable that via an override.
        </p>
        <Modal button>
            <span slot="button" class="row gap-1"><Icon icon="image" /> Show Images</span>
            <div class="row gap-1">
                <Image src="https://i.imgur.com/CTf2yxh.png" alt="everyone overrides" />
                <Image src="https://i.imgur.com/YVdwg1W.png" alt="verified overrides" />
                <Image src="https://i.imgur.com/yu3QZgx.png" alt="everyone overrides part 2" />
            </div>
        </Modal>
        <Linkable e="h3" id="access-roles">How do I set up access roles?</Linkable>
        <p>
            You may want to lock some channels behind access roles such as reaction roles, or staff channels for staff roles. For example, you might want to
            restrict your leaks channel behind a self-assignable role. In this case, you will need to use an allow role-level override. It is unavoidable, but
            this is acceptable because usually you don't need to set deny role-level overrides just for viewing the channel.
        </p>
        <p>
            Firstly, add a deny <Mention>everyone</Mention>-level override for <A to="/info/discord/permission-list#VIEW_CHANNEL" external>View Channel</A>.
            Then, add allow role-level overrides for any roles you want to grant access.
        </p>
        <p>
            Importantly, do not enable any other permissions such as sending messages. If a user cannot see a channel, they cannot take any actions relating to
            the channel anyway.
        </p>
        <Linkable e="h3" id="public-staff-channels">What about public channels that only staff can send messages in?</Linkable>
        <p>
            For this, you will need to grant an allow role-level override. However, if it's going to staff, it is fine. The reason you want to avoid allow
            role-level overrides is that it stops you from disabling it per role via things like mute roles. However, you should not need to mute your staff
            members. Also, you have the option to use timeouts if needed.
        </p>
        <Linkable e="h3" id="mute-role">How do I set up a mute role?</Linkable>
        <Callout style="info">
            <p>
                Before you read this, consider if you want to use mute roles. Discord now has timeouts which are very similar but built into the system. There
                are several advantages - it makes it obvious to the user that they are timed out, lets moderators easily identify that they are timed out
                without letting other users be able to know, and shows a countdown to the user in the client.
            </p>
            <p>
                There are a few disadvantages as well - it can only last up to 28 days, and it disables all permissions except view channel and read message
                history. In fact, they cannot even react, even to reactions that already exist, and cannot interact with buttons either. This prevents them from
                using reaction roles.
            </p>
        </Callout>
        <p>
            If you have decided that you want to use a mute role instead, you will want to set an override in every channel (where the mute role matters) that
            denies permissions you want muted users to be unable to use. We recommend
            <A to="/info/discord/permission-list#SEND_MESSAGES" external>Send Messages</A>,
            <A to="/info/discord/permission-list#SEND_MESSAGES_IN_THREADS" external>Send Messages in Threads</A>,
            <A to="/info/discord/permission-list#ADD_REACTIONS" external>Add Reactions</A>, and
            <A to="/info/discord/permission-list#CONNECT" external>Connect</A>. If you allow regular members to create threads, you should deny those
            permissions to the mute role as well.
        </p>
    </Navigation>
</div>
