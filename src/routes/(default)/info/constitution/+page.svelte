<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation next={["/info/quickstart", "Quickstart"]}>
        <h1>TCN Constitution</h1>
        <Link to="/info/constitution/simple">Simplified Version</Link>
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
                        Each server has a primary representative, which is the server owner unless <Link to="#delegation">delegated</Link> to the council advisor.
                    </li>
                    <li>Each person may only hold one council position and for one server.</li>
                </ul>
            </li>
            <li>
                The <Link to="#observer-committee"><b>Observer Committee</b></Link> refers to elected, official administrators of the council who carry out official
                and administrative duties and tasks.
            </li>
            <li><b>HQ</b> refers to the private server which belongs to the council and is used for internal operations, collaboration, and communication.</li>
            <li>
                The <b>TCN Hub</b> refers to the public server which serves as a medium of communication for the council, TCN members, and the general public.
            </li>
        </ul>
        <Linkable e="h3" id="objectives">Objectives</Linkable>
        <p>
            The objective of the TCN is to unite mains-style servers and facilitate communication, collaboration, and the sharing of information and resources
            to enable stable, healthy communities.
        </p>
        <ul>
            <li>
                <b>Information</b> &mdash; The TCN seeks to provide information on ongoing events, incidents, and problematic users, and help and resources for technical
                issues, staff management, and community management and building.
            </li>
            <li>
                <b>Connections</b> &mdash; The TCN seeks to provide a space for Genshin Impact communities to maintain close relationships, offer a direct line of
                communication for coordination of events and other ollaborations, and unite community managers in the collective pursuit of building strong, healthy
                environments for their communities.
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
                <b>Growth</b> &mdash; The council seeks to discuss and develop methods to grow the TCN, both in its size and its ability to provide resources and
                meet its goals.
            </li>
        </ul>
        <Linkable e="h3" id="structure">Structure</Linkable>
        <h4>Observer Committee</h4>
        <p>
            The observer committee is a group of TCN Council Members who are elected by the council to carry out official and administrative tasks, represent
            the network, maintain its values, and enforce rules within the network and HQ. The specific responsibilities and expectations of the
            <Link to="#observer-committee">observer committee</Link> and the mechanisms of <Link to="#election-votes">elections</Link> are discussed later in the
            constitution.
        </p>
        <h4>Constituent Servers</h4>
        <p>
            Constituent servers of the TCN are character mains servers that have passed an <Link to="#induction">induction</Link> vote to join the network. Each
            server must be associated with one playable character and cannot rebrand while within the network, but one playable character may have multiple constituent
            servers.
        </p>
        <h4>External Partners</h4>
        <p>
            The TCN may choose to partner with other entities on a case-by-case basis, but this is a very special consideration. This is only done if the other
            entity has something to provide for the network as a whole and/or all of its constituent servers. <Link to="#external-partners">Read more...</Link>
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
                In addition to TCN servers, it must contain the TCN website URL, the TCN Hub invite and description, the Genshin Wizard website URL and
                description, and the Genshin Impact Tavern invite and description.
            </li>
        </ul>
        <h4>Network Events</h4>
        <ul>
            <li>
                Servers must follow <span class="mention with-icon"><Icon icon="tag" /> network-events</span> in a channel visible to the general public of the server.
            </li>
            <li>Under <Link to="#event-promotion">specific circumstances</Link>, servers may delete event cross-promotions.</li>
        </ul>
        <h4>Terms of Service</h4>
        <ul>
            <li>
                Servers must follow Discord's <Link to="https://discord.com/terms" external>Terms of Service</Link> and
                <Link to="https://discord.com/guidelines" external>Community Guidelines</Link>.
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
                Voters are expected to take voting seriously and vote in line with what they believe is best for their server and the network with respect to
                the purpose and goals of the TCN and the council.
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
                The TCN cannot collectively agree or disagree with any statement. It can decide to act in a particular manner, but that does not reflect on
                anyone or the network's opinion.
            </li>
            <li>
                Nobody, including staff of TCN servers, may use the TCN's name to reinforce any statements or add credibility or authority.
                <ul>
                    <li>
                        It is allowed to mention the TCN or specify that a server belongs to the TCN &mdash; this rule states that attempting to use the TCN's
                        name for effect in the document rather than stating facts is not allowed.
                    </li>
                </ul>
            </li>
            <li>
                Only observers may represent the TCN or authorize people to represent the TCN when acting on external matters upon which the council has voted
                and agreed. They may not represent the opinion or perspective of the network or any constituent server or council member.
            </li>
        </ul>
        <h3>Staff Management</h3>
        <p>
            A major vote may be conducted to require a server to remove a staff member if there is sufficient reason to believe that the staff member's actions
            and/or behavior constitute a risk to the TCN (e.g. spreading misinformation or violating the aforementioned rules).
        </p>
        <ul>
            <li>
                Staff members are allowed to dislike the TCN or disagree with its actions &mdash; this rule only applies to spreading misinformation that
                degrades the TCN's reputation, speaking on behalf of the network, or using its name inappropriately.
            </li>
        </ul>
        <Linkable e="h2" id="observer-committee">Observer Committee</Linkable>
        <ul>
            <li>
                Any council member may become an observer through election. There may be up to 8 observers at any time. Observers have a term length of 6 months
                and must be re-elected to continue serving their position.
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
                                Specifically, observers may choose to freeze conversations if they have derailed and become unproductive following warnings
                                about maintaining civility.
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
                <li>Unexplained absence / failure to meet membership duties (<Link to="#absence">Read more...</Link>)</li>
            </ul>
            <h3>Council Advisors</h3>
            <ul>
                <li>Removal by the server owner for any reason.</li>
                <li>
                    Unexplained absence / failure to meet membership duties (<Link to="#absence">Read more...</Link>) while they are the primary representative
                    of their server.
                </li>
            </ul>
        </ul>
    </Navigation>
</div>
