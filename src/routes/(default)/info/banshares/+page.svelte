<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import ITitle from "$lib/components/ITitle.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/quickstart#banshares", "Quickstart"]}>
        <h1>Banshares</h1>
        <A to="#submitting" class="row gap-1"><Icon icon="expand_more" /> Submitting Guide</A>
        <Linkable e="h2" id="overview">Overview</Linkable>
        <p>This is the lifecycle of a banshare:</p>
        <div class="panel">
            <ITitle e="h4" icon="upload">Submit</ITitle>
            <p>
                A banshare is submitted to the <A to="/banshare" external>banshare form</A>. It is posted to <Mention type="text">ban-share-logs</Mention> and reviewed
                by the observer team.
            </p>
            <hr />
            <ITitle e="h4" icon="published_with_changes">Publish</ITitle>
            <p>
                Once it is approved, an observer will publish it and it will be posted to all TCN servers that have banshares set up, as well as the TCN Hub.
                The bot will also automatically ban the user(s) in servers where autoban is enabled.
            </p>
            <hr />
            <ITitle e="h4" icon="unpublished">Rescind</ITitle>
            <p>
                We strive to avoid this from happening, but if a banshare is found to be invalid for any reason, we will rescind it with a reason and perform a
                postmortem to see why a faulty banshare was approved.
            </p>
            <p>
                This may also be done if the user's behavior improves substantially and we retroactively agree to un-banshare them. Just as servers are not
                required to ban banshared users, they are not required to unban users in these cases either.
            </p>
        </div>
        <Callout style="info">
            <p>
                When the bot performs automated actions, either through autoban or the ban button, it will log the action in your logging channel(s) if you set
                it up. Here's what the log message looks like:
            </p>
            <Image src="https://imgur.com/WgKPMrs.png" alt="Banshare log output" />
            <p>
                This is probably most appropriate for the channel in which your mods use commands rather than the mod actions audit log, but you are of course
                welcome to put it wherever you want.
            </p>
        </Callout>
        <Linkable e="h2" id="setup">Setup</Linkable>
        <p>
            To set up the banshare system, first invite the bot using <A
                to="https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot"
                >this link</A
            >.
        </p>
        <Callout style="red" icon="warning">
            <p>You must grant the bot read and write access to any channels receiving the banshares or where you want the bot to post logs.</p>
        </Callout>
        <ol>
            <li>Use <code>/banshares subscribe</code> to register a channel to receive banshares (<code>/banshares unsubscribe</code> to revert).</li>
            <li>Use <code>/banshares log enable</code> to register a channel to send log output (<code>/banshares log disable</code> to revert).</li>
            <li>Use <code>/banshares settings</code> to modify your server's settings, including enabling autoban.</li>
        </ol>
        <Linkable e="h2" id="severity">Severity</Linkable>
        <p>
            Banshares are categorized into three severity levels and a special category. These are not strictly defined, and observers can adjust the severity
            before publishing. These are primarily used for autoban thresholds, should be primarily based on threat level, and do not indicate how "bad" we
            believe a user is. Here are our guidelines:
        </p>
        <div class="panel">
            <ITitle e="h4" icon="expand_less" icon_color="rgb(var(--red-text))">P0 (Critical)</ITitle>
            <p>The offense is extremely severe and all servers should immediately ban them for safety.</p>
            <ul>
                <li>
                    A user spamming NSFW or NSFL content should be <b>P0</b>, as this violates all servers' rules and Discord's Terms of Service and constitutes
                    an immediate and grave threat to member safety.
                </li>
                <li>
                    Hacked or raid accounts posting spam or scam links should be <b>P0</b>, as despite the offense not being very severe, they are likely to
                    become a nuisance in many other TCN servers and there is likely no reason a server would not want them banned.
                </li>
            </ul>
            <hr />
            <ITitle e="h4" icon="remove" icon_color="rgb(var(--yellow-text))">P1 (Medium)</ITitle>
            <p>
                The offense is somewhat severe and the majority of servers, if not all of them, will want to ban them; however, individual servers may have
                other considerations and choose not to ban them.
            </p>
            <ul>
                <li>
                    A user using slurs enough times to be banned with a reasonable amount of warnings (i.e. they are aware that what they are saying is wrong or
                    were being deliberately malicious from the start) should be <b>P1</b>, as this violates all servers' rules and most will just immediately
                    ban them unless they have enough positive contributions to be potentially given a last chance.
                </li>
            </ul>
            <hr />
            <ITitle e="h4" icon="expand_more" icon_color="rgb(var(--blue-text))">P2 (Low)</ITitle>
            <p>
                The offense is not extreme and some servers may not wish to ban the user. Do note that very minor offenses should not be banshared at all
                &mdash; this is for more nuanced cases but still cases where the user presents a threat to other servers.
            </p>
            <ul>
                <li>
                    A user repeatedly stirring up trouble or randomly attacking members should be <b>P2</b>, as some servers will want to pre-emptively
                    eliminate a potential disturbance but some other servers may want to give them a chance and only ban them if their behavior repeats there.
                </li>
            </ul>
            <hr />
            <ITitle e="h4" icon="message" icon_color="rgb(var(--text-2))">DM Scam</ITitle>
            <p>The offense is a DM scam. These are categorized separately as some servers do not wish to receive these banshares.</p>
            <p>
                Note that spamming scam links within a server should be <b>P0</b> and other offenses within DMs such as harassment should be evaluated separately.
                This only applies to accounts attempting to scam users by DMing them, e.g. steam scams, fake nitro scams, art scams, etc.
            </p>
        </div>
        <Linkable e="h2" id="submitting">Submitting</Linkable>
        <p>
            To post a banshare, go to <A to="/banshare" external>this form</A>. All fields should be fairly intuitive, but here is a usage guide for each.
        </p>
        <ul>
            <li>
                <b>IDs:</b> The IDs of the offending users. Please post this as an actual list of IDs. If it is too long, it will be automatically uploaded as a
                document, but if you paste a link, autoban will not work. If it is so long that the form rejects it, then you may need to post it as a link
                instead.
                <ul>
                    <li>Once you paste your IDs, click <b>Check IDs</b> to fetch all of the users' tags to make sure you are bansharing the right people.</li>
                </ul>
            </li>
            <li>
                <b>Reason:</b> Summarize why the users should be banned. This is used as the audit log reason for automated bans, so please write a detailed reason
                and leave notes in the evidence.
            </li>
            <li>
                <b>Evidence:</b> Include enough evidence to prove that your reasons are valid and for other mods to make an informed decision on what to do.
            </li>
            <li>
                <b>Server:</b> Choose the server from which you are submitting this banshare. If the incident is not bound to a particular server or is not from
                one you staff, you should pick your "main" server or the one in which you feel you have the most prominent position. If you do not see a
                particular server here, reach out to the server owner and direct them to <A to="/info/staff-link" external>this page</A>.
            </li>
            <li><b>Severity:</b> <A to="#severity">See above</A>.</li>
            <li><b>Urgency:</b> If you check the <b>urgent</b> box, this will ping all observers to review it immediately.</li>
        </ul>
        <Callout style="red">
            <p>
                If the ID list is very long, you may want to use <b>Submit Without Validation</b> to skip checking if the IDs are valid, which will take a long
                time. Do
                <b>not</b> use <b>Submit Without Checking IDs</b> unless you had to submit it using a link in the ID field and there was no way around it. Skipping
                this check prevents automated banning from working.
            </p>
            <p>
                The regular submission option will validate that all of your IDs correspond to valid users. Submitting without validation will only verify that
                the IDs look like the correct format and will parse them such that autoban will work.
            </p>
        </Callout>
        <Linkable e="h2" id="policy">Policy</Linkable>
        <Linkable e="h3" id="purpose">Purpose</Linkable>
        <p>
            The purpose of the banshare system is as a pre-emptive safety measure. Banshares should be used to eliminate threats from the network and ensure
            server safety, not as a punishment.
        </p>
        <Linkable e="h3" id="requirements">Banshare Requirements</Linkable>
        <p>The following are required of banshares at a minimum, but meeting these requirements does not necessarily ensure a banshare is good enough:</p>
        <ul>
            <li>
                <b>Demonstrable Threat:</b> The offense must be severe enough that the user should be considered a threat to any other servers they join, and
                there must be sufficient reason to believe that the user may join TCN servers.
                <ul>
                    <li>Spamming NSFW in a TCN server satisfies both conditions.</li>
                    <li>
                        Being banned for repeat minor offenses in one server does not satisfy the first condition unless their behavior repeats again elsewhere.
                    </li>
                    <li>
                        Spamming NSFW in a random server not associated with the TCN or the Genshin Impact community does not satisfy the second condition as
                        there is no demonstrable threat to the network unless the user is already in any TCN or Genshin Impact servers.
                    </li>
                </ul>
            </li>
            <li>
                <b>Descriptive Reason:</b> The reason must clearly explain what the offense was. A moderator should be able to understand why they were banned
                by just looking at the ban reason on its own.
                <ul>
                    <li>"Spamming NSFW images in XYZ Mains" is a good reason.</li>
                    <li>"Typical steam scammer" is an acceptable reason.</li>
                    <li>"Troll" is not a good reason.</li>
                </ul>
            </li>
            <li>
                <b>Sufficient Evidence:</b> The provided evidence must prove that the offense happened as described in the ban reason and all listed users were involved.
                Exceptions are granted in the case of large raids as it is both impractical to attach evidence for every single user and for the team to review that
                much evidence. In those cases, trust is placed on the author to ensure that the list of users is correct.
            </li>
        </ul>
    </Navigation>
</div>
