<script lang="ts">
    import A from "$lib/components/A.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
</script>

<h2>Happy Holidays!</h2>
<p>
    Interested in celebrating the spirit of giving with the rest of the network? We're hosting a network-wide <b>Secret Santa</b> event! Read below for details on
    the event, and how to sign up and participate.
</p>
<h3>What's Secret Santa?</h3>
<p>
    Secret Santa is a holiday festivity usually done with a group of people in-person. Ahead of time, people will be assigned to each other as their "secret
    santas". Each person will know who they're giving a gift to, but not who will be giving to them.
</p>
<p>
    On the day of the gift exchange, the gifts will all be piled up and people will take turns opening their gift, and usually people will learn who gave them
    their gift once they open it or at the end.
</p>
<p>
    Of course, we can't do this, so we've adapted the idea into a virtual event where you'll be able to fulfill someone else's wishlist through an online
    platform like Amazon or Steam in exchange for a similar gift!
</p>
<h3>How will this work?</h3>
<p>
    When you sign up, you'll be assigned a recipient and their wishlist and you'll have to fulfill a gift first. Once you do so, you'll be added to the waitlist
    for someone else to gift to you in the future.
</p>
<p>At the end of the event, the initial pool of recipients, who will be trusted network members, will gift to anyone left in the waitlist.</p>
<h3>Great, how do I sign up?</h3>
<p>
    <LinkButton to="/secret-santa/form">Sign up here!</LinkButton>
</p>
<h3>Other Questions / Notes</h3>
<h6>Why is it saying too many people are signing up at once?</h6>
<p>
    To ensure smooth operation, there is a ratelimit on exchanges to make sure we can keep an eye on everything and verify everything is working correctly. If
    this persists for a long time after you try again multiple times, <A to="/contact" external>contact us</A> and we'll look into it.
</p>
<h6>What if I give my gift but then the time limit runs out?</h6>
<p>
    Submit it as soon as you can. While your time slot is active, your recipient is locked out of being assigned to anyone else. The time limit only exists so
    that people cannot lock someone out indefinitely. If you submit the form, we will still pull the recipient out of the pool.
</p>
<p>
    However, if the time limit runs out or you think it might run out before you can submit, we would recommend cancelling. You'll be barred from re-entering
    for a bit to prevent abuse, but you'll have a chance to participate again very soon.
</p>
<h6>I can't fulfill the gift because the recipient's information is invalid.</h6>
<p>
    We verify each form submission by hand, but if you find any issues, please <A to="/contact" external>let us know</A> right away and we'll take a look.
</p>
<div style="padding-bottom: 4em" />
