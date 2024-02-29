<script lang="ts">
    import A from "$lib/components/A.svelte";
    import ITitle from "$lib/components/ITitle.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
</script>

<div class="container">
    <div id="main">
        <h1>About the Teyvat Collective Network</h1>
        <Linkable id="what" e="h2">What is the TCN?</Linkable>
        <p>
            The Teyvat Collective Network, also known as the TCN, is a network of high-quality Genshin Impact Discord servers dedicated to fostering Mains-style
            fan communities. We place an emphasis on collaborative community-building, servers offering help and resources to each other, and maintaining
            healthy and safe communities for Genshin Impact fans to find a home in on Discord.
        </p>
        <Linkable id="organization" e="h2">Organization</Linkable>
        <p>
            The TCN does not enforce any particular structure on its member servers. TCN servers are not required to change their server setup, follow a
            template, enforce particular rules, or give any permissions to TCN observers. Our only requirements are to display a list of TCN partner servers,
            cross-post event promotions from partner servers, and maintain a healthy community that follows its rules.
        </p>
        <p>The TCN is divided into three components:</p>
        <div class="panel">
            <ITitle e="h3" icon="business">Individual Servers</ITitle>
            <p>These are the individual servers of the TCN, each a mains server dedicated to a specific character.</p>
            <p>Find a list of TCN servers <A to="/members">here</A>.</p>
            <hr />

            <ITitle e="h3" icon="hub">The Hub</ITitle>
            <p>
                This is the official public server for the TCN, where you can contact observers and other server staff and ask questions or give feedback about
                the TCN.
            </p>
            <p><A to="https://discord.gg/FG2wpbywSx" external>Join the Hub!</A></p>
            <hr />

            <ITitle e="h3" icon="high_quality">HQ</ITitle>
            <p>
                This is the headquarters server for the TCN. It is private to the TCN council, which consists of each server's owner and up to one other trusted
                member. This server facilitates communication and coordination of servers.
            </p>
        </div>
        <Linkable id="benefits" e="h2">Benefits of the TCN</Linkable>
        <div class="panel">
            <ITitle e="h3" icon="info">Information</ITitle>
            <p>
                As a member server of the TCN, you get access to information on members, ongoing issues, as well as informative resources like server setup and
                tools and on-demand help for the technical aspects and community and staff management.
            </p>
            <hr />
            <ITitle e="h3" icon="handshake">Connections</ITitle>
            <p>
                TCN servers have quick and easy access to communication with each other. In addition to being able to more quickly resolve any issues and form
                strong relationships with many other prominent servers, you have the unique opportunity to more easily start collaborations for things like
                events, which you can also promote through the TCN's event announcement feed.
            </p>
            <hr />
            <ITitle e="h3" icon="insights">Growth</ITitle>
            <p>
                When you join the TCN, you automatically become a TCN partner of all TCN servers and will have your server listed on the partner list in all of
                them. Additionally, you will be able to get tips on how to improve your server environment and grow a strong, healthy community.
            </p>
            <hr />
            <ITitle e="h3" icon="share">Networking</ITitle>
            <p>
                As a TCN server, besides direct connections with other server owners, you will also have access to networking with admins in HQ and with other
                server admins and staff through their TCN representatives.
            </p>
            <hr />
            <ITitle e="h3" icon="public">Global Channels</ITitle>
            <p>
                You will have access to global channels, which are channels where messages are relayed to all connected servers. We have a public global channel
                so your members can talk to members all across the TCN from the comfort of your server, as well as channels for staff. You will also be able to
                use these channels for collaboration events if you want participating servers' members to be able to talk to each other from any server.
            </p>
            <hr />
            <ITitle e="h3" icon="emergency_share">Banshares</ITitle>
            <p>
                You gain access to TCN Banshares, which are a system we have that lets you receive or automatically ban problematic users ahead of time so you
                don't have to deal with them the hard way. All of our banshares are manually reviewed by our observers. See the
                <A to="/info/banshares">banshare info page</A> for more information.
            </p>
        </div>
        <Linkable id="core-values" e="h2">Our Core Values</Linkable>
        <div class="panel">
            <ITitle e="h3" icon="forum">Transparency</ITitle>
            <p>
                We prioritize two-way communication with our member servers. We are always open to feedback and will reach out for opportunities to improve the
                network to work for our members, and not the other way around.
            </p>
            <hr />
            <ITitle e="h3" icon="how_to_vote">Democracy</ITitle>
            <p>
                In addition to communicating major changes with our members clearly, we propose these changes and vote on major decisions on them, and the
                observer team does not have any more of a say in matters than everyone else. Each server gets one vote in all important matters. We also
                implement follow-up changes based on feedback.
            </p>
            <hr />
            <ITitle e="h3" icon="group">Collaboration</ITitle>
            <p>
                We don't expect everyone in the TCN to like everyone else, but even when discussions are heated we treat each other with civility and get to the
                core of the issue and come to a resolution that can benefit us all as much as possible. Additionally, we learn from conflicts, and every mistake
                or dispute is an opportunity to not just fix the root of the issue but improve other parts of the network.
            </p>
        </div>
    </div>
</div>
