<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Invite from "$lib/components/Invite.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import { debounce } from "$lib/utils";
    import { onMount } from "svelte";

    let done = false;
    beforeNavigate(({ cancel }) => done || confirm("Are you sure you want to leave this page? You will lose any unsaved changes.") || cancel());

    export let form: any;

    let role = form?.role ?? "owner";
    let invite = form?.invite ?? "";
    let inviteData: any;

    async function checkInvite() {
        invite = invite.trim().split("/").at(-1);

        const req = await fetch(`/api/invites/${encodeURIComponent(invite)}`);
        inviteData = req.ok ? await req.json() : null;
    }

    onMount(checkInvite);
</script>

<form class="container" method="post" on:submit={() => (done = true)}>
    <h2>TCN Application Form</h2>
    {#if form?.error}
        <Callout style="red">
            <p>{@html form.error}</p>
        </Callout>
        <br />
    {:else if form?.success}
        <Callout style="green">
            <p>Your application has been submitted! We appreciate your patience.</p>
        </Callout>
        <br />
    {/if}
    <Callout style="info">
        <p>
            If you haven't already, read our <A to="/join" external>info page</A> on the process for joining the TCN and what to expect. If you have any questions,
            comments, or concerns, please reach out to us. See our <A to="/contact" external>contact information</A> page.
        </p>
        <p>Please make sure your DMs are open so we can reach out to you to respond to your application.</p>
    </Callout>
    <br />
    <LoggedInAs />
    <div class="panel">
        <h5>You must consent to all of the below.</h5>
        <label>
            <input type="checkbox" name="observerchannelconsent" required class="bg-1" checked={form?.observerchannelconsent} />
            <span>I agree to give my server's observer view access to <b>all channels</b> for the observation period.</span>
        </label>
        <label>
            <input type="checkbox" name="observerauditconsent" required class="bg-1" checked={form?.observerauditconsent} />
            <span>I agree to give my server's observer access to the audit logs for the observation period.</span>
        </label>
        <label>
            <input type="checkbox" name="partnerlistconsent" required class="bg-1" checked={form?.partnerlistconsent} />
            <span>I agree to display the TCN partner list publicly and keep it up-to-date (<A to="/info/partner-list" external>learn more</A>).</span>
        </label>
        <label>
            <input type="checkbox" name="eventsconsent" required class="bg-1" checked={form?.eventsconsent} />
            <span>
                I agree to follow <Mention type="text">network-events</Mention> publicly to cross-promote TCN server events and post crucial TCN announcements.
            </span>
        </label>
    </div>
    <div class="panel">
        <h5>Which Genshin Impact character is your server based on?</h5>
        <input type="text" name="mascot" class="bg-1" placeholder="Character Name" style="width: 50%" required autocomplete="off" value={form?.mascot ?? ""} />
        <br /><br />
        <hr />
        <h5>What is your role in the server?</h5>
        <p>If you are not the server owner, make sure you have permission to apply to the TCN and have discussed this with the server owner!</p>
        <div class="row gap-1">
            <select name="role" class="bg-1" bind:value={role}>
                <option value="owner">Server Owner</option>
                <option value="admin">Administrator</option>
                <option value="mod">Moderator</option>
                <option value="other">Other...</option>
            </select>
            {#if role === "other"}
                <input type="text" name="roleother" class="bg-1" style="width: 50%" required autocomplete="off" value={form?.roleother ?? ""} />
            {/if}
        </div>
        {#if role !== "owner"}
            <h5>Server Owner's ID</h5>
            <input
                type="text"
                name="ownerid"
                class="bg-1"
                placeholder="17-20 digit number"
                pattern={"^[1-9][0-9]{16,19}$"}
                style="width: 50%"
                required
                autocomplete="off"
                value={form?.ownerid ?? ""}
            />
            <br />
        {/if}
        <br />
        <hr />
        <h5>Enter an invite code pointing to your server.</h5>
        <h6>Please use a permanent, non-vanity invite.</h6>
        <input type="text" name="invite" class="bg-1" style="width: 50%" on:input={debounce(checkInvite)} required autocomplete="off" bind:value={invite} />
        <br />
        {#if inviteData}
            {#if inviteData.vanity}
                <br />
                <Callout style="red">
                    <p>Vanity URLs are not allowed.</p>
                </Callout>
            {/if}
            {#if inviteData.expires}
                <br />
                <Callout style="red">
                    <p>This invite expires on {new Date(inviteData.expires).toLocaleString()}. Please provide a permanent invite.</p>
                </Callout>
            {/if}
            {#if inviteData.target}
                <br />
                <Callout style="red">
                    <p>Please provide an invite that does not point to a stage instance, application, or user stream.</p>
                </Callout>
            {/if}
            {#if inviteData.members < 300}
                <br />
                <Callout style="info">
                    <p>
                        We <b>recommend</b> that your server has 300 members before you apply. This is not a strict requirement, but a suggested threshold so that
                        we can be confident your community is developed and stable enough for long-term success.
                    </p>
                </Callout>
            {/if}
            {#if !inviteData.vanity && !inviteData.expires && !inviteData.target && inviteData.members >= 300}
                <br />
                <Callout style="green">
                    <p>Your invite link looks good! Make sure it is pointing to the correct server.</p>
                </Callout>
            {/if}
            <br />
            <Invite {invite} />
        {:else}
            <br />
            <Callout style="red">
                <p>Invalid Invite!</p>
            </Callout>
        {/if}
        <br />
        <hr />
        <h5>Does your server contain an NSFW section?</h5>
        <label>
            <input type="radio" name="nsfw" class="bg-1" value="private" required checked={form?.nsfw === "private"} />
            <span>Yes, hidden from regular users behind a role.</span>
        </label>
        <label>
            <input type="radio" name="nsfw" class="bg-1" value="public" required checked={form?.nsfw === "public"} />
            <span>Yes, visible to regular users.</span>
        </label>
        <label>
            <input type="radio" name="nsfw" class="bg-1" value="no" required checked={form?.nsfw === "no"} />
            <span>No.</span>
        </label>
    </div>
    <div class="panel">
        <h5>
            Do you have prior experience running a Discord server or similar communities in a position of management or moderation (e.g. forums, guilds, clans,
            etc.)?
        </h5>
        <h6>You do not have to have been the owner of the server / forum / etc.; any position of management or moderation is of interest.</h6>
        <Textarea name="experience" value={form?.experience} class="bg-1" placeholder="Max length: 1024 characters" maxlength={1024} />
        <br />
        <hr />
        <h5>What are some of your short-term goals or ideas for the server?</h5>
        <Textarea
            name="shortgoals"
            value={form?.shortgoals}
            class="bg-1"
            placeholder="Required &mdash; Max length: 1024 characters"
            required
            maxlength={1024}
        />
        <br />
        <hr />
        <h5>What are some of your long-term goals or ideas for the server?</h5>
        <Textarea name="longgoals" value={form?.longgoals} class="bg-1" placeholder="Required &mdash; Max length: 1024 characters" required maxlength={1024} />
        <br />
        <hr />
        <h5>Please give us a rough outline of your server's history.</h5>
        <h6>
            For example, if your server has ever rebranded, please list its former identities. Additionally, what inspired/motivated you to start the server,
            and what notable events or changes have occurred or what troubles have you had to overcome?
        </h6>
        <Textarea name="history" value={form?.history} class="bg-1" placeholder="Required &mdash; Max length: 1024 characters" required maxlength={1024} />
    </div>
    <div class="panel">
        <h5>Any additional questions or comments you'd like to include?</h5>
        <Textarea name="additional" value={form?.additional} class="bg-1" placeholder="Max length: 1024 characters" maxlength={1024} />
    </div>
    <Callout style="info">
        <p>
            Make sure you check our <A to="/contact" external>list of observers</A>
            before giving permissions to whoever contacts you!
        </p>
    </Callout>
    <br />
    <button>Submit!</button>
</form>
