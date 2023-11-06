<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
</script>

<div class="container">
    <h1>TCN Constitution</h1>
    <Linkable e="h2" id="preface">Preface</Linkable>
    <Linkable e="h3" id="definitions">Definitions</Linkable>
    <ul>
        <li>The <b>Teyvat Collective Network</b> (TCN) refers to the collective entity formed by all constituent servers and the <b>TCN Hub</b>.</li>
        <li>
            The <b>Teyvat Collective Network Council</b> (or just the <b>council</b>) refers to the designated group of representatives.
            <ul>
                <li>Each server's owner must be present on the council as a <b>Server Owner</b>.</li>
                <li>Each server may designate one other person to be present on the council as a <b>Council Advisor</b>.</li>
                <li>
                    Each server has a primary representative, which is the server owner unless <A to="#delegation">delegated</A> to the council advisor.
                </li>
                <li>Each person may only hold one council position and for one server.</li>
            </ul>
        </li>
        <li>
            The <A to="#observer-committee"><b>Observer Committee</b></A> refers to elected, official administrators of the council who carry out official and administrative
            duties and tasks.
        </li>
        <li><b>HQ</b> refers to the private server which belongs to the council and is used for internal operations, collaboration, and communication.</li>
        <li>
            The <b>TCN Hub</b> refers to the public server which serves as a medium of communication for the council, TCN members, and the general public.
        </li>
    </ul>
    <Linkable e="h3" id="objectives">Objectives</Linkable>
    <p>
        The objective of the TCN is to unite mains-style servers and facilitate communication, collaboration, and the sharing of information and resources to
        enable stable, healthy communities.
    </p>
    <ul>
        <li>
            <b>Information</b> &mdash; The TCN seeks to provide information on ongoing events, incidents, and problematic users, and help and resources for technical
            issues, staff management, and community management and building.
        </li>
        <li>
            <b>Connections</b> &mdash; The TCN seeks to provide a space for Genshin Impact communities to maintain close relationships, offer a direct line of communication
            for coordination of events and other ollaborations, and unite community managers in the collective pursuit of building strong, healthy environments for
            their communities.
        </li>
    </ul>
    <p>
        The objective of the TCN Council is to provide the space to allow the TCN's objectives to be realized, provide help and resources, and promote and
        uphold the TCN's reputation, stability, and future.
    </p>
    <ul>
        <li>
            <b>Communication</b> &mdash; The council seeks to establish and maintain communication between communities to facilitate the goals of the TCN.
        </li>
        <li>
            <b>Promotion</b> &mdash; The council seeks to promote and uphold the TCN's reputation and stability and maintain its growth and development.
        </li>
        <li>
            <b>Growth</b> &mdash; The council seeks to discuss and develop methods to grow the TCN, both in its size and its ability to provide resources and meet
            its goals.
        </li>
    </ul>
    <Linkable e="h3" id="structure">Structure</Linkable>
    <h4>Observer Committee</h4>
    <p>
        The observer committee is a group of TCN Council Members who are elected by the council to carry out official and administrative tasks, represent the
        network, maintain its values, and enforce rules within the network and HQ. The specific responsibilities and expectations of the
        <A to="#observer-committee">observer committee</A> and the mechanisms of <A to="#election-votes">elections</A> are discussed later in the constitution.
    </p>
    <h4>Constituent Servers</h4>
    <p>
        Constituent servers of the TCN are character mains servers that have passed an <A to="#induction">induction</A> vote to join the network. Each server must
        be associated with one playable character and cannot rebrand while within the network, but one playable character may have multiple constituent servers.
    </p>
    <h4>External Partners</h4>
    <p>
        The TCN may choose to partner with other entities on a case-by-case basis, but this is a very special consideration. This is only done if the other
        entity has something to provide for the network as a whole and/or all of its constituent servers. <A to="#external-partners">Read more...</A>
    </p>
    <Linkable e="h2" id="duties">Duties</Linkable>
    <Linkable e="h3" id="constituent-servers">Constituent Servers</Linkable>
    <h4>Partner List</h4>
    <p>Servers must display the <b>TCN Partner List</b>:</p>
    <ul>
        <li>It must be clearly separate from other partner lists (servers' other affiliations are not restricted or controlled by the TCN).</li>
        <li>It must contain all TCN servers and no non-TCN servers.</li>
        <li>It must be visible to the general public of the server.</li>
        <li>
            In addition to TCN servers, it must contain the TCN website URL, the TCN Hub invite and description, the Genshin Wizard website URL and description,
            and the Genshin Impact Tavern invite and description.
        </li>
    </ul>
    <h4>Network Events</h4>
    <ul>
        <li>
            Servers must follow <Mention type="text">network-events</Mention> in a channel visible to the general public of the server.
        </li>
        <li>Under <A to="#event-promotion">specific circumstances</A>, servers may delete event cross-promotions.</li>
    </ul>
    <h4>Terms of Service</h4>
    <ul>
        <li>
            Servers must follow Discord's <A to="https://discord.com/terms" external>Terms of Service</A> and
            <A to="https://discord.com/guidelines" external>Community Guidelines</A>.
        </li>
    </ul>
    <Linkable e="h3" id="council-members">Council Members</Linkable>
    <h4>HQ Membership</h4>
    <ul>
        <li>To facilitate communication, council members must be in HQ.</li>
        <li>If a member does not join HQ within 7 days of receiving their invite link or leaves HQ, the observer team will attempt to contact them.</li>
        <li>Opportunity will be given to explain and no punishment will be issued for unintentionally not joining or leaving.</li>
        <li>
            If a member refuses to (re)join or give reasonable justification or respond within 7 days, they may be removed from the council with no vote
            required.
        </li>
    </ul>
    <h4>Discussions</h4>
    <ul>
        <li>
            Council members are <b>encouraged</b> to participate in all discussions where they feel that they have perspectives or considerations to contribute.
        </li>
        <li>Council members are <b>expected</b> to participate in matters involving themselves or their server.</li>
        <li>Discussions are to remain civil and aligned with the purpose and goals of the TCN and the council.</li>
        <li>
            Discussions are to be kept private within HQ unless explicit permission to share content outside of HQ has been granted by all involved parties.
        </li>
    </ul>
    <h4>Voting</h4>
    <ul>
        <li>Each server's primary representative is required to vote on all matters unless specified otherwise.</li>
        <li>All members are expected to vote during elections and any other special-case votes that are opened to everyone.</li>
        <li>
            Voters are expected to take voting seriously and vote in line with what they believe is best for their server and the network with respect to the
            purpose and goals of the TCN and the council.
        </li>
        <li>Voters are expected to read the provided materials to make informed decisions.</li>
    </ul>
    <Linkable e="h2" id="external-affairs">External Affairs &amp; Management</Linkable>
    <h3>TCN Neutrality</h3>
    <p>
        The TCN does <b>not</b> hold an official or collective stance or opinion on any matters. The council votes on actions that the network agrees to execute,
        but there is no collective opinion and nobody, including observers, may speak on behalf of the TCN to give a stance or opinion. The following is non-exhaustive.
    </p>
    <ul>
        <li>
            The TCN cannot collectively agree or disagree with any statement. It can decide to act in a particular manner, but that does not reflect on anyone
            or the network's opinion.
        </li>
        <li>
            Nobody, including staff of TCN servers, may use the TCN's name to reinforce any statements or add credibility or authority.
            <ul>
                <li>
                    It is allowed to mention the TCN or specify that a server belongs to the TCN &mdash; this rule states that attempting to use the TCN's name
                    for effect in the document rather than stating facts is not allowed.
                </li>
            </ul>
        </li>
        <li>
            Only observers may represent the TCN or authorize people to represent the TCN when acting on external matters upon which the council has voted and
            agreed. They may not represent the opinion or perspective of the network or any constituent server or council member.
        </li>
    </ul>
    <h3>Staff Management</h3>
    <p>
        A major vote may be conducted to require a server to remove a staff member if there is sufficient reason to believe that the staff member's actions
        and/or behavior constitute a risk to the TCN (e.g. spreading misinformation or violating the aforementioned rules).
    </p>
    <ul>
        <li>
            Staff members are allowed to dislike the TCN or disagree with its actions &mdash; this rule only applies to spreading misinformation that degrades
            the TCN's reputation, speaking on behalf of the network, or using its name inappropriately.
        </li>
    </ul>
    <Linkable e="h2" id="observer-committee">Observer Committee</Linkable>
    <ul>
        <li>
            Any council member may become an observer through election. There may be up to 8 observers at any time. Observers have a term length of 6 months and
            must be re-elected to continue serving their position.
            <ul>
                <li>The term limit is 6 calendar months, meaning each term ends on the same day-of-month as it started.</li>
                <li>
                    There is a grace period of 14 days following the end of an observer's term for them to be re-elected. If the election is ongoing, this
                    period is extended as needed.
                </li>
            </ul>
        </li>
        <li>
            The observer committee has the following duties and responsibilities:
            <ul>
                <li>Observe applicant servers for induction (there is no quota for observations).</li>
                <li>Administrative tasks such as handling and executing server changes and decisions made by the council.</li>
                <li>Manage votes, including elections.</li>
                <li>Represent the network when acting on behalf of the council in line with what has been agreed upon by vote.</li>
                <li>Review and publish banshares and network event posts.</li>
                <li>Enforce rules.</li>
                <li>
                    Ensure civility.
                    <ul>
                        <li>
                            Specifically, observers may choose to freeze conversations if they have derailed and become unproductive following warnings about
                            maintaining civility.
                        </li>
                    </ul>
                </li>
                <li>Any other exception handling such as handling threats to HQ or network security.</li>
            </ul>
        </li>
        <li>
            The observer committee is subject to the following restrictions;
            <ul>
                <li>
                    As with everyone else, they do not speak on behalf of the opinion and perspectives or the network, its constituent servers, or council
                    members.
                </li>
                <li>Observers may not make major decisions or change TCN rules on their own; those must be passed by vote through the council.</li>
            </ul>
        </li>
        <Linkable e="h2" id="removal">Removal from the TCN</Linkable>
        <p>Servers and council members are subject to removal from the TCN or the council for the following reasons and via the following methods:</p>
        <h3>Servers</h3>
        <ul>
            <li>Voluntary withdrawal by the server owner.</li>
            <li>
                Removal of the server owner without transfer to a new server owner.
                <ul>
                    <li>
                        If a server owner is removed, they have up to one week to declare a new server owner and up to two weeks to transfer the server to
                        remain in the network.
                    </li>
                    <li>
                        If the outgoing server owner fails to meet the timeline as specified above, the server will be removed without penalty and must be
                        re-inducted to return.
                    </li>
                </ul>
            </li>
        </ul>
        <h3>Server Owners</h3>
        <ul>
            <li>Unexplained absence / failure to meet membership duties (<A to="#absence">Read more...</A>)</li>
        </ul>
        <h3>Council Advisors</h3>
        <ul>
            <li>Removal by the server owner for any reason.</li>
            <li>
                Unexplained absence / failure to meet membership duties (<A to="#absence">Read more...</A>) while they are the primary representative of their
                server.
            </li>
        </ul>
        <h3>Voluntary Departure</h3>
        <ul>
            <li>
                A member may voluntarily leave their council position at any time. Observers may voluntarily step down from the observer committee without
                leaving their council position at any time.
            </li>
        </ul>
        <h3>Involuntary Removal</h3>
        <ul>
            <li>
                If a server is found to not meet the expectations or rules of the TCN, a major vote may be started to remove it from the TCN with penalty. If
                this occurs, its representatives may be transferred to another council position, and if not, will lose their eligibility to remain on the
                council.
            </li>
            <li>
                If a member is found to not meet the expectations or rules of the TCN, either in terms of fulfilling their duties or due to individual behavior,
                a major vote may be started to forcefully remove them from the network.
                <ul>
                    <li>
                        If this happens, they may not be transferred to another council position and must follow the usual procedure to return to the council.
                    </li>
                    <li>
                        If a council advisor is removed while being the primary representative, the server is exempt from activity requirements until the server
                        owner's planned absence ends, after which it is their responsibility to find a new council advisor if needed.
                    </li>
                </ul>
            </li>
            <li>
                Documentation presented against a server or council member must be made available to the target for at least 7 days to allow time to respond
                (extended for up to 7 days if any involved party is on break), extended if the documentation is particularly long.
            </li>
            <li>
                Once a response has been provided, a minimum of 2 days must be given to the council to read the presented information and response, extended for
                discussion or if the documentation or response is particularly long, before any votes regarding the issue.
            </li>
        </ul>
    </ul>
    <Linkable e="h2" id="induction">Induction</Linkable>
    <ul>
        <li>Servers must be observed for 28 days before their induction vote.</li>
        <li>
            If the server has been observed before:
            <ul>
                <li>If it was removed without penalty and less than two months have passed, it is eligible for a reduced 14-day observation.</li>
                <li>
                    If its last observation was less than six months ago and it was not rejected and did not have its observation extended by vote, it is
                    eligible for a reduced 14-day observation.
                </li>
                <li>A minor vote may be conducted to require a server to undergo full observation.</li>
            </ul>
        </li>
        <li>
            Upon application, a notice must be posted with a ping for the alert role. 72 hours must be given for discussion before observation may begin, and if
            there is ongoing discussion regarding whether or not to allow the server to be observed, an observation may not begin, but the observer team may
            reach out to the applicant to provide transparency on the timeline.
        </li>
        <li>A minor vote may be conducted to reject a server without observation.</li>
        <li>A major vote may be conducted to halt observation and immediately reject a server.</li>
        <li>Once observation has finished, a report will be published by the observer.</li>
        <li>A minimum of 24 hours, extended as needed for discussion, must be given before a vote may begin.</li>
        <li>A minor vote will determine the outcome of the induction process.</li>
        <li>
            If a server is approved, it must join the network within the next two months. A server can be removed in the same way as a constituent server before
            it technically joins, which will revoke its right to join the TCN. If more than two months pass, it will need to undergo the induction process
            again.
        </li>
    </ul>
    <Linkable e="h2" id="external-partners">External Partners</Linkable>
    <ul>
        <li>
            Organizations that are not character mains servers (e.g. Discord bots, online utility resources, other servers, etc.) may request to partner with
            the TCN.
        </li>
        <li>
            In these cases, there is no standard procedure, and one or more observers will discuss terms with the organization's representative(s) to arrange
            details and what both sides will offer.
        </li>
        <li>It is expected that a third-party partner will treat all TCN servers as partners and vice versa.</li>
        <li>A major vote is required to establish an external partner.</li>
    </ul>
    <Linkable e="h2" id="voting">Voting</Linkable>
    <Linkable e="h3" id="general-protocols">General Protocols</Linkable>
    <ul>
        <li>Quorum refers to the requirement for voter turnout, which is the proportion of eligible voters who vote or abstain.</li>
        <li>A minor vote requires 60% quorum for its result to be considered valid. A major vote requires 75%.</li>
        <li>Votes' live results must be hidden until the vote concludes.</li>
        <li>Abstaining is always permitted and counts towards voter turnout and voting duty. Abstention votes are ignored during tallying.</li>
        <li>
            Votes must be presented the council at least 24 hours before they are conducted, extended as needed for discussion. Any concerns raised must be
            addressed and resolved first. This excludes votes such as elections, inductions, etc. which have special requirements.
        </li>
        <li>Information required for voters to make an informed decision must be made available with the vote ping.</li>
        <li>Votes must be open for at least 48 hours and a DM or ping reminder must be sent at least 24 hours before the vote ends.</li>
        <li>If the voter turnout requirement is not met, the vote will be extended by 48 hours.</li>
        <li>If a vote ties, a discussion will be opened to solidify the council's stance, and then the vote will be repeated as-is unless stated otherwise.</li>
        <li>If the vote ties twice, the server will be automatically rejected (or if the tie is between inducting now and later, deferred).</li>
    </ul>
    <Linkable e="h3" id="proposal-votes">Proposal Votes</Linkable>
    <ul>
        <li>If 60% or more votes are in favor, the motion passes.</li>
        <li>If 40% or fewer votes are in favor, the motion fails.</li>
        <li>Otherwise, the vote is considered a tie.</li>
    </ul>
    <Linkable e="h3" id="selection-votes">Selection Votes</Linkable>
    <ul>
        <li>
            By default, if the first and second most popular options are within a 10% margin, the vote is considered a tie. Otherwise, the most popular option
            is selected, even if it does not reach a majority.
        </li>
        <li>This can be adapted per vote based on what is sensible.</li>
    </ul>
    <Linkable e="h3" id="election-votes">Election Votes</Linkable>
    <ul>
        <li>Elections must be open to all council members.</li>
        <li>If only one candidate is running, there will be a proposal vote to determine if they are elected.</li>
        <li>
            Otherwise, a ranked vote will be held.
            <ul>
                <li>
                    Each user may rank up to <code>K</code> of the <code>X</code> candidates from <code>1</code> to <code>K</code> and abstain or vote against
                    the other <code>X - K</code> candidates.
                </li>
                <li>Each ballot gives a candidate <code>X - R</code> points, where <code>R</code> is the ranking given.</li>
                <li>An abstained ballot counts as abstaining for all candidates.</li>
                <li>If a candidate receives more rejections than rankings, they are dropped from the election.</li>
                <li>
                    The top <code>S</code> candidates are selected and announced in arbitrary order with no indication of the overall ranking, where
                    <code>S</code> is the number of seats.
                </li>
                <li>If there is an exact tie when selecting these candidates, the election will be held again.</li>
            </ul>
        </li>
    </ul>
    <Linkable e="h3" id="induction-votes">Induction Votes</Linkable>
    <ul>
        <li>
            The options are to induct the server, reject the server, or extend the observation. If the server's mascot character is not officially confirmed as
            playable when the vote occurs, a fourth option to pre-approve the server but induct them at a later date will be added.
        </li>
        <li>
            Positive votes (induction, pre-approve) will be compared against negative votes (reject, extend observation) and compared using the policy for
            proposal votes.
        </li>
        <li>
            If there is not a tie, then the options within the group will be compared using the policy for proposal votes. If there is a tie here, the vote will
            be repeated but with the only available options being the ones in the selected group.
        </li>
        <li>A server that is pre-approved will automatically become eligible for induction when their mascot character is officially confirmed as playable.</li>
        <li>A minor vote may be started to induct a server that is pre-approved at any time.</li>
        <li>
            If the vote ties twice, the server will be rejected (or if the tie is between inducting now and later, deferred). This overrides the default
            behavior of going to an observer vote.
        </li>
    </ul>
    <Linkable e="h3" id="observer-votes">Observer Votes</Linkable>
    <ul>
        <li>
            Observer votes will only be used if the council is unable to make a decision due to failure to reach the voter turnout requirement or reaching a tie
            twice.
        </li>
        <li>All observers must vote or abstain and the majority decision will be the final determination.</li>
        <li>The observer vote is not allowed to tie and the observer team is expected to discuss, either publicly or privately, to make a final decision.</li>
    </ul>
    <Linkable e="h2" id="event-promotion">Event Promotion</Linkable>
    <ul>
        <li>
            Events involving at least one TCN server may be posted to <Mention type="text">network-events</Mention> and published across the network. The webhook
            URL is pinned in the channel.
        </li>
        <li>
            Events must be SFW and must follow TCN rules, Discord's Terms of Service and Community Guidelines, and Genshin Impact's Terms of Service (plus any
            other similar relevant terms or guidelines).
        </li>
        <li>
            Servers may delete an event if any of the following apply:
            <ul>
                <li>The event involves non-TCN servers (this allows servers to remove promotion of servers with whom they have a hostile relationship).</li>
                <li>
                    They have already promoted the event and mentioned all involved TCN servers (this avoids duplicate announcements).
                    <ul>
                        <li>
                            For example, if servers <code>X</code>, <code>Y</code>, and <code>Z</code> hold an event in collaboration where <code>X</code>
                            and <code>Y</code> are in the TCN, then <code>X</code> may delete the cross-post as long as they have already promoted
                            <code>Y</code>.
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
    <Linkable e="h2" id="membership-changes">Membership Changes</Linkable>
    <ul>
        <li>To add a new member to the council, a notice must be posted with a ping for the alert role.</li>
        <li>24 hours must be given to allow for counter-votes. A minor vote may be conducted to deny the user entry into the council.</li>
        <li>Change in position of existing council members does not require any advance notice and cannot be counter-voted.</li>
    </ul>
    <Linkable e="h2" id="delegation">Delegation</Linkable>
    <ul>
        <li>A server owner may delegate their responsibilities and the position of primary representative to their council advisor.</li>
        <li>
            Each server starts with 60 days of eligibility. Delegation consumes this time and the server gains back one day per day up to 60 days while the
            position is not delegated. This is to prevent the server owner from being indefinitely absent.
        </li>
        <li>If the server owner changes, this time is reset to 60 days.</li>
        <li>
            During delegation, the server owner will not be considered absent but the council advisor may be if they fail to uphold the responsibilities
            otherwise expected of the server owner.
        </li>
        <li>
            If the council advisor is removed during this time, the server owner will regain the ability to vote but will not be penalized for failing to do so
            for the duration of their delegation. They may appoint a new council advisor and continue to delegate the position to them.
        </li>
    </ul>
    <Linkable e="h2" id="absence">Absence</Linkable>
    <p>
        This section is a non-exhaustive guideline for what constitutes absence. The meeting of these conditions does not always imply that a council member
        should be removed, or are these conditions required for a council member to be considered as failing to meet their responsibilities. The council's
        judgement (through voting) is required to remove a council member.
    </p>
    <ul>
        <li>
            Failure to respond to official inquiries or outreach from the observer team (e.g. regarding a missing or outdated partner list) for over 3 weeks.
        </li>
        <li>
            Failure to vote thrice in a row (if the member is absent for a vote, any overlapping votes or votes in extremely close proximity will not be counted
            again).
        </li>
        <li>If they have not been present to support their server's staff such that it is actively inhibiting the server's ability to succeed.</li>
    </ul>
    <Linkable e="h2" id="amendments">Amendments</Linkable>
    <ul>
        <li>A major vote is required to amend the constitution, including adding, removing, or changing any rules.</li>
    </ul>
    <Linkable e="h2" id="extras">Extras</Linkable>
    <p>This section lists any additional rules or regulations that do not fit into existing sections.</p>
    <ul>
        <li>
            AI chat bots are banned from global channels. An AI chat bot is any bot that responds to messages generatively (i.e. rather than storing a
            predefined list of responses, it generates them). This definition cannot be made objective, so borderline cases will be discussed with the hosting
            server and a binding decision may be made by the observer team or by vote if it is the appropriate course of action.
        </li>
    </ul>
</div>
