<script lang="ts">
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import LoggedInAs from "$lib/components/LoggedInAs.svelte";
    import Textarea from "$lib/components/Textarea.svelte";
    import Timestamp from "$lib/components/Timestamp.svelte";
    import UserMention from "$lib/components/UserMention.svelte";
    import { blockApproval } from "$lib/secret-santa";
    import { token } from "$lib/stores";
    import type { SecretSantaUser } from "$lib/types";

    export let form: any;
    let data = $page.data as unknown as SecretSantaUser & { error?: string; agreed?: boolean; partnerInfo?: string };

    let remaining = Math.floor(((data.time ?? 0) - Date.now()) / 1000);
    setInterval(() => (remaining = Math.floor(((data.time ?? 0) - Date.now()) / 1000)), 1000);
</script>

{#if form?.success}
    <Callout style="green">
        <p>{form.success}</p>
    </Callout>
    <br />
{/if}
{#if form?.error || data.error}
    <Callout style="red">
        <p>{form?.error || data.error}</p>
    </Callout>
    <br />
{/if}
{#if data.status === "none"}
    <h2><b>Secret Santa</b> &mdash; Sign-up Form</h2>
    <LoggedInAs />
    <form method="POST" action="?/initialize">
        <p>Hey there! Make sure you've read the <A to="/secret-santa">info page</A> first before starting the sign-up process.</p>
        <p>
            Before you start, please read the following carefully. Once you lock in, you will receive the recipient's name and info (their wishlist). You will
            have half an hour to send a gift to them, so be sure you are ready to complete the transaction before you lock in!
        </p>
        <p>
            If you wish to cancel at any time, you may do so, but you will be locked out a day. Note that cancelling three times will permanently ban you from
            the event. Don't close the form unless you cancel! If you do, you can reopen it within the time window, but you may still be able to submit a bit
            after your time runs out; however, this is not guaranteed and you may become ineligible to receive a gift if you fail to fulfill and respond to the
            form in time.
        </p>
        <p>If you encounter any issues or have any questions, <A to="/contact" external>let us know</A> and we'll sort it out for you.</p>
        <br />
        <hr />
        <br />
        <h4>Your Info</h4>
        <p>
            Put down your info here. Please provide a link to your wishlist on some platform such as Amazon, Steam, etc. as well as any other information for
            your gift-giver. No NSFW allowed. You will not be able to edit this once you've started the workflow.
        </p>
        <p>We're setting a <b>USD$20</b> limit. Please link a wishlist with at least a few items with at least one under USD$10.</p>
        <Textarea name="info" value={data.info ?? ""} required maxlength={1024} />
        <label>
            <input type="checkbox" class="bg-3" required checked={!!data.agreed} />
            I confirm that I have read the provided information and will fulfill my gift or accept the stated penalties.
        </label>
        <br />
        <hr />
        <br />
        <input type="submit" name="submit" value="Lock In" />
        <input type="submit" name="submit" value="Save without locking in" class="text-accent" style="background-color: transparent" />
    </form>
{:else if data.status === "locked-sender" || data.status === "locked-out"}
    {@const suspended = data.status === "locked-out"}
    <h2><b>Secret Santa</b> &mdash; Locked {suspended ? "Out" : "In"}</h2>
    <Callout style={suspended ? "warn" : "info"}>
        {#if suspended}
            <p>
                You have been locked out. Please do not give a gift anymore. However, if you already did, you should submit your proof as soon as possible. If
                there was some issue along the way, please contact support and we can manually unlock you.
            </p>
        {:else}
            <p>
                You are locked in and have
                <b>
                    {remaining >= 60
                        ? `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, "0")}`
                        : `${remaining} second${remaining === 1 ? "" : "s"}`}
                </b>
                (until <b><Timestamp ms mode="time" timestamp={data.time ?? 0} /></b>).
            </p>
        {/if}
    </Callout>
    <br />
    <form method="POST" action="?/prove">
        {#if suspended}
            <p>You were originally assigned to <b><UserMention id={data.partner ?? "unknown"} /></b>.</p>
        {:else}
            <p>
                Hey there! You're locked in. You will be giving a gift to <b><UserMention id={data.partner ?? "unknown"} /></b>! Here's the info they submitted:
            </p>
            <div class="panel">
                {@html data.partnerInfo}
            </div>
            <p><b>We're setting a USD$20 limit.</b> Please try your best not to gift over this limit for fairness.</p>
        {/if}
        <p>
            Once you've given them a gift, please upload your proof to an image hosting service (such as <A to="https://imgur.com" external>Imgur</A>) or
            somewhere like Google Drive and link it below. Make sure it's publicly visible.
        </p>
        <Textarea name="proof" value="" required />
        <label>
            <input type="checkbox" class="bg-3" required />
            I affirm that the proof I have submitted is truthful and understand that deception will be punished heavily.
        </label>
        <br />
        <input type="submit" value="Submit!" />
    </form>
    {#if !suspended}
        <br />
        <hr />
        <form method="POST" action="?/bail">
            <p>Ran into issues and can't fulfill this gift? You can cancel below.</p>
            <label>
                <input type="checkbox" class="bg-3" required />
                I confirm that I wish to cancel and understand that I will be locked out from participating temporarily.
            </label>
            <br />
            <input type="submit" value="Forfeit" style="background-color: rgb(var(--red-button)); color: white" />
        </form>
    {/if}
{:else if data.status === "awaiting-approval"}
    <h2><b>Secret Santa</b> &mdash; Awaiting Approval</h2>
    <p>Hey! We're reviewing your proof right now. Please give us some time. Thanks!</p>
    <p>
        At this point, you've completed all of the steps you need to! You can refer back to this page for your updated status, but you are free to close this
        page and wait for your gift to arrive!
    </p>
    <p>Thank you for participating!</p>
{:else if data.status === "pool-free" || data.status === "pool-locked"}
    <h2><b>Secret Santa</b> &mdash; Approved</h2>
    <p>Hey! Your proof was <b>approved</b>! You are now in the pool for receiving a gift.</p>
    <p>Thank you for participating!</p>
{:else if data.status === "limbo"}
    <h2><b>Secret Santa</b> &mdash; Gift-giver Pending Approval</h2>
    <p>
        Your giver submitted proof of their gift to you. If you did not receive anything, please <A to="/contact">let us know</A> immediately. This will help us
        to ensure that all proof that we approve is valid.
    </p>
    <p>Thank you for participating!</p>
    <p><button on:click={() => blockApproval($token)}>Block Approval</button></p>
{:else if data.status === "done"}
    <h2><b>Secret Santa</b> &mdash; Done!</h2>
    <p>
        Hey! Your participation in this event is now complete! Our records show that you gave a gift, were approved, and received a gift. If you did not receive
        a gift and our approval was faulty, please <A to="/contact">contact us</A> immediately. We'll sort it out with you and we assure you that you will get something!
    </p>
{:else if data.status === "banned"}
    <h2><b>Secret Santa</b> &mdash; <span class="red-text">Banned</span></h2>
    <p>You were <span class="red-text">banned</span> from this event. This was done by an admin due to forged proof or other violations of the rules.</p>
    <p>If this was our mistake, please <A to="/contact">contact us</A> immediately and we'll fix it right away.</p>
{/if}
<div style="padding-bottom: 4em" />
