<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import ITitle from "$lib/components/ITitle.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
    import Show from "$lib/components/Show.svelte";
    import { select } from "$lib/html-utils";
    import { alerts } from "$lib/stores";

    const { copy: copyStore } = alerts;

    const open: Record<string, boolean> = {};

    function copy(id: string) {
        navigator.clipboard.writeText(select(`#${id}`).innerHTML);
        copyStore.update((x) => x + 1);
        setTimeout(() => copyStore.update((x) => x - 1), 1500);
    }
</script>

<div class="container">
    <Navigation last={["/info/quickstart#partner-list", "Quickstart"]}>
        <h1>Partner List &amp; Autosync</h1>
        <Callout style="info">
            <p>
                The following methods will meet all of the requirements, and if you like the default style and don't need to customize it, you can use these
                options.
            </p>
            <ul>
                <li>Post it from <A to="https://embeds.leaf.moe/TCN_partners">embeds.leaf.moe</A>.</li>
                <li>Use <code>/partner-list view</code> on the TCN bot.</li>
                <li>Set up <A to="#autosync">autosync</A>.</li>
            </ul>
        </Callout>
        <Linkable e="h2" id="requirements">Requirements</Linkable>
        <p>You must include all of the following:</p>
        <ul>
            <li><b>Website URL</b>: <A to="/">https://teyvatcollective.network</A>.</li>
            <li><b>Description:</b> A description of the TCN.</li>
            <li><b>Partner List:</b> The list of all TCN partners which must not contain any other servers.</li>
            <li>
                <b>TCN Hub:</b> The description for the TCN Hub and its invite link (<A to="https://discord.gg/FG2wpbywSx" external
                    >https://discord.gg/FG2wpbywSx</A
                >).
            </li>
            <li>
                <b>Genshin Wizard:</b> The description for Genshin Wizard and its website link (<A to="https://genshinwizard.com" external
                    >https://genshinwizard.com</A
                >).
            </li>
            <li>
                <b>Genshin Impact Tavern:</b> The description for Genshin Impact Tavern and its invite (<A to="https://discord.gg/genshinimpacttavern" external
                    >https://discord.gg/genshinimpacttavern</A
                >).
            </li>
            <li>
                <b>Daedalus:</b> The description for Daedalus and its dashboard link (<A to="https://daedalusbot.xyz" external>https://daedalusbot.xyz</A>).
            </li>
        </ul>
        <p>
            You do not need to include all of these verbatim, but here is our recommendation for the descriptions. Your description is expected to convey the
            same information, but you may write it in your own style.
        </p>
        <div class="panel">
            <ITitle e="h4" icon="notes">General Description</ITitle>
            <p><i>"In Teyvat, the stars in the sky will always have a place for you."</i></p>
            <p>
                A network of high-quality Genshin Impact character-mains style servers that focus on creating fan communities. Within the network, individual
                and network-wide events are held such as: tournaments, scavenger hunts, and other fun events, community nights, giveaways, and patch preview
                livestreams.
            </p>
            <button class="row" on:click={() => (open.general = !open.general)}><Icon icon="markdown" /> {open.general ? "Hide" : "Show"} Markdown</button>
            <Show when={open.general}>
                <pre id="desc-general">_"In Teyvat, the stars in the sky will always have a place for you."_

A network of high-quality Genshin Impact character-mains style servers that focus on creating fan communities. Within the network, individual and network-wide events are held such as: tournaments, scavenger hunts, and other fun events, community nights, giveaways, and patch preview livestreams.</pre>
                <button class="row" on:click={() => copy("desc-general")}><Icon icon="content_copy" /> Copy</button>
            </Show>
            <hr />
            <ITitle e="h4" icon="hub">TCN Hub</ITitle>
            <p>
                Join us in the official TCN Hub to ask questions about the network, talk to other network members, get information on the network and how to
                apply, and contact observers (admins)! <A to="https://discord.gg/FG2wpbywSx">https://discord.gg/FG2wpbywSx</A>
            </p>
            <button class="row" on:click={() => (open.hub = !open.hub)}><Icon icon="markdown" /> {open.hub ? "Hide" : "Show"} Markdown</button>
            <Show when={open.hub}>
                <pre
                    id="desc-hub">Join us in the official TCN Hub to ask questions about the network, talk to other network members, get information on the network and how to apply, and contact observers (admins)! https://discord.gg/FG2wpbywSx</pre>
                <button class="row" on:click={() => copy("desc-hub")}><Icon icon="content_copy" /> Copy</button>
            </Show>
            <hr />
            <ITitle e="h4" icon="auto_fix_high">Genshin Wizard</ITitle>
            <p>
                The TCN is partnered with <A to="https://genshinwizard.com">Genshin Wizard</A>, a multipurpose Genshin Impact Discord bot with a wide array of
                features to let you view your in-game stats, flex your builds, view build guides and hundreds of high-quality infographics, and more!
            </p>
            <button class="row" on:click={() => (open.wizard = !open.wizard)}><Icon icon="markdown" /> {open.wizard ? "Hide" : "Show"} Markdown</button>
            <Show when={open.wizard}>
                <pre
                    id="desc-wizard">The TCN is partnered with [Genshin Wizard](https://genshinwizard.com), a multipurpose Genshin Impact Discord bot with a wide array of features to let you view your in-game stats, flex your builds, view build guides and hundreds of high-quality infographics, and more!</pre>
                <button class="row" on:click={() => copy("desc-wizard")}><Icon icon="content_copy" /> Copy</button>
            </Show>
            <hr />
            <ITitle e="h4" icon="sports_bar">Genshin Impact Tavern</ITitle>
            <p>
                The TCN is partnered with <A to="https://discord.gg/genshinimpacttavern">Genshin Impact Tavern</A>, a multifaceted Discord Community Server for
                Genshin Impact! Check out their RPG-like experience through which you can redeem official merch, their Cat's Tail Gathering TCG tournament, and
                more!
            </p>
            <button class="row" on:click={() => (open.tavern = !open.tavern)}><Icon icon="markdown" /> {open.tavern ? "Hide" : "Show"} Markdown</button>
            <Show when={open.tavern}>
                <pre
                    id="desc-tavern">The TCN is partnered with [Genshin Impact Tavern](https://discord.gg/genshinimpacttavern), a multifaceted Discord Community Server for Genshin Impact! Check out their RPG-like experience through which you can redeem official merch, their Cat's Tail Gathering TCG tournament, and more!</pre>
                <button class="row" on:click={() => copy("desc-tavern")}><Icon icon="content_copy" /> Copy</button>
            </Show>
            <hr />
            <ITitle e="h4" icon="change_history">Daedalus</ITitle>
            <p>
                The TCN is partnered with Daedalus, a general-purpose Discord bot that offers a high-quality server management experience. TCN servers get free
                access to the custom client feature. Check out <A to="https://daedalusbot.xyz">its website</A> for more information!
            </p>
            <button class="row" on:click={() => (open.daedalus = !open.daedalus)}><Icon icon="markdown" /> {open.daedalus ? "Hide" : "Show"} Markdown</button>
            <Show when={open.daedalus}>
                <pre
                    id="desc-daedalus">The TCN is partnered with Daedalus, a general-purpose Discord bot that offers a high-quality server management experience. TCN servers get free access to the custom client feature. Check out [its website](https://daedalusbot.xyz) for more information!</pre>
                <button class="row" on:click={() => copy("desc-daedalus")}><Icon icon="content_copy" /> Copy</button>
            </Show>
        </div>
        <Linkable e="h2" id="autosync">Autosync</Linkable>
        <Callout style="info">
            <p><b>What does this do?</b> Autosync seamlessly keeps your partner embed up-to-date without needing any action from you after initial setup!</p>
            <p>You can choose a message that will be edited each time or set the bot to automatically delete and re-post the embed each time.</p>
            <p>Don't want to follow the default format? Customization options are available!</p>
        </Callout>
        <ol>
            <li>
                Invite the TCN bot using <A
                    to="https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot"
                    external>this link</A
                >.
            </li>
            <li>Run <code>/autosync channel set</code> to set up an embed instance in a specific channel.</li>
            <li>Run <code>/autosync webhook set</code> to set up an embed instance using a webhook (this overrides the <b>channel</b> option).</li>
            <li>Run <code>/autosync mode set</code> if you would like the embed to be re-posted each time instead of edited when there is an update.</li>
            <li>
                To change the format (template) of the embed, go to <b>Manage Servers</b> on the dashboard (in the left navigation menu &mdash; you need to be
                logged in). For help with using this, ask us in <Mention type="text">dev-chat</Mention> in HQ or the TCN Hub.
            </li>
        </ol>
    </Navigation>
</div>
