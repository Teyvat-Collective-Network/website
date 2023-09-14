<script lang="ts">
    import Linkable from "$lib/components/Linkable.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/join#observation-faq", "Joining the TCN"]}>
        <div id="main">
            <h1>Observation FAQ</h1>
            <Linkable id="process" e="h2">The Process</Linkable>
            <p>
                Observation is the period of time during which one of our observers will oversee all operations in the server, requiring view permissions to all
                channels and the audit logs. Throughout the process, they will also facilitate communication between your server and the network, including
                passing on concerns about your server but also forwarding questions you may have along the way.
            </p>
            <p>
                At the end of observation, the observer will create a report evaluating your server's environment and staff organization and performance, which
                will be shared to you for feedback. Afterwards, a vote will be held to induct your server into the TCN.
            </p>
            <p>
                At any point, you may choose to cancel observation which means your server will not be inducted into the TCN and you may remove the observer's
                permissions.
            </p>
            <Linkable id="why-access" e="h2">Why does the observer need access to everything?</Linkable>
            <p>
                The observer's duty is to provide the council with all of the information necessary to make an informed decision on whether or not your server
                is fit for the TCN and vice versa. Being able to evaluate everything that happens in your server is crucial to this process. Audit log access is
                needed to be able to corroborate actions your staff take.
            </p>
            <p>
                We may discuss some matters internally as an observer team, but nothing will be shared with the rest of the network until you review the report,
                so you don't have to worry about the observer spying on your server and sharing information without your permission with the network.
            </p>
            <p>
                If there is information that we believe is crucial to the result and will not leave out, you may at any point withdraw your application and we
                will not publish any report or share the information.
            </p>
            <Linkable id="what-to-do-when-rejected" e="h2">My server was rejected. What now?</Linkable>
            <p>
                You may re-apply after 3 weeks, unless we have specifically informed you that we will not reconsider in the future. If you re-apply, we expect
                you to have addressed all reasons that were brought up leading to your rejection/denial.
            </p>
            <p>
                If we did not give you any reasons, there are probably private reasons usually involving serious concerns with the owner or prominent admins
                that we believe make your server irredeemable, in which case it is unlikely we will reconsider.
            </p>
            <Linkable id="requesting-different-observer" e="h2">Can I request a different observer?</Linkable>
            <p>
                We will avoid assigning observers that have personal ties, either positive or negative, with you or your staff. However, if you have personal
                issues with the observer that was assigned, you may reach out to another observer to request someone else to be selected.
            </p>
            <p>
                If there are no options that we are willing or able to assign to you that you are okay with, we may have to either postpone until the observer
                committee changes or other observers are available, or we may have to agree to cancel, at least until a later date.
            </p>
            <p>
                If at any point throughout the process you believe the observer is being problematic, you may wish to report them to another observer and we
                will discuss how to proceed from there (usually, we can just transfer the observation to someone else without causing you any delays, and we may
                relieve the observer of their duty if we find it is necessary).
            </p>
            <p>
                If you believe you are not being fairly represented in the report, you may discuss that with them and propose changes, but they do not have to
                follow all of your requests and are required to present all necessary information for the council to make an informed decision. If you believe
                any misinformation was presented or the facts are misconstrued in a way to make your server look bad, you may provide evidence to another
                observer to have the matter privately discussed.
            </p>
        </div>
    </Navigation>
</div>
