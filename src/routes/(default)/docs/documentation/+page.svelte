<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import A from "$lib/components/A.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
    import Show from "$lib/components/Show.svelte";
    import { user } from "$lib/stores";
    import { highlight } from "$lib/utils";
    import { onMount } from "svelte";

    export let data: any;

    const cheat_sheet = [
        ["# heading 1", "<h1 style='margin: 0'>heading 1</h1>"],
        ["## heading 2", "<h2 style='margin: 0'>heading 2</h2>"],
        ["### heading 3", "<h3 style='margin: 0'>heading 3</h3>"],
        ["#### heading 4", "<h4 style='margin: 0'>heading 4</h4>"],
        ["##### heading 5", "<h5 style='margin: 0'>heading 5</h5>"],
        ["###### heading 6", "<h6 style='margin: 0'>heading 6</h6>"],
        [["**bold**", "__bold__"], "<b>bold</b>"],
        [["*italics*", "_italics_"], "<i>italics</i>"],
        ["> blockquote", "<blockquote>blockquote</blockquote>"],
        ["1. this is an<br />2. ordered<br />3. list", "<ol><li>this is an<li>ordered<li>list</ol>"],
        ["- this is an<br />- unordered<br />- list", "<ul><li>this is an<li>unordered<li>list</ul>"],
        ["---", "<hr />"],
        ["[link](https://google.com)", "<tcn-link to='https://google.com' external>text</tcn-link>"],
        [
            `![alt text](${PUBLIC_DOMAIN}/favicon.png)`,
            "<img src='/favicon.png' alt='alt text' /><br />alt text is optional, but please include it for accessibility",
        ],
        [
            "```js<br />console.log('Hello, World!');<br />```",
            "<pre><code class='language-js'>console.log('Hello, World!');</code></pre><p>Replace <code>js</code> with <code>text</code> for no syntax highlighting.</p>",
        ],
        ["~~strikethrough~~", "<s>strikethrough</s>"],
    ];

    const feature_list = [
        ["[u]underline[/u]", "<u>underline</u>"],
        ["H[sub]2[/sub]O", "H<sub>2</sub>O"],
        ["x[sup]2[/sup]", "x<sup>2</sup>"],
        [
            "[table] [tr] [th l] left-aligned [/th]<br />             [th c] centered [/th]<br />             [th r] right-aligned [/th] [/tr]<br />        [tr] [td l] abc [/td]<br />             [td c] def [/td]<br />             [td r] ghi [/td] [/tr] [/table]",
            "<table style='width: 100%'><tr><th class='right-align'>right-aligned</th><th class='center'>center-aligned</th><th class='left-align'>left-aligned</th></tr><tr><td class='right-align'>text</td><td class='center'>text</td><td class='left-align'>text</td></tr></table>",
        ],
        [
            "[@251082987360223233]",
            "<span class='mention with-icon' data-id='251082987360223233'><span class='material-symbols-outlined'>alternate_email</span> <user-id id='251082987360223233' /></span>",
        ],
        ["[%role]", "<span class='mention with-icon'><span class='material-symbols-outlined'>alternate_email</span> Observers</span>"],
        [
            "[878812623796310044%Observers]",
            "<span class='row gap-1'><span class='mention with-icon' data-id='878812623796310044'><span class='material-symbols-outlined'>alternate_email</span> Observers</span> (click to copy ID)</span>",
        ],
        ["[#channel]", "<span class='mention with-icon'><span class='material-symbols-outlined'>tag</span> channel</span>"],
        [
            "[t#general]<br />[a#announcements]<br />[v#voice]<br />[f#forum]<br />[s#stage]<br />[c#category]",
            "<ul class='space'><li><span class='mention with-icon'><i class='material-symbols-outlined'>tag</i>&nbsp;general</span><br /></li><li><span class='mention with-icon'><i class='material-symbols-outlined'>campaign</i>&nbsp;announcements</span><br /></li><li><span class='mention with-icon'><i class='material-symbols-outlined'>volume_up</i>&nbsp;voice</span><br /></li><li><span class='mention with-icon'><i class='material-symbols-outlined'>forum</i>&nbsp;forum</span><br /></li><li><span class='mention with-icon'><i class='material-symbols-outlined'>podcasts</i>&nbsp;stage</span><br /></li><li><span class='mention with-icon'><i class='material-symbols-outlined'>folder</i>&nbsp;category</span></li></ul>",
        ],
        [
            "[:1234567890]",
            "<span class='row gap-1'><span class='mention with-icon' data-id='1234567890'><span class='material-symbols-outlined'>schedule</span> <time-stamp timestamp='1234567890' /></span> (click to copy timestamp)</span>",
        ],
        ["[:2020-05-27]", "<span class='mention with-icon'><span class='material-symbols-outlined'>schedule</span> 2020-05-27</span>"],
        [
            "[reader]",
            `<span class="mention with-icon"><span class="material-symbols-outlined">${$user ? "alternate_email" : "account_circle"}</span> ${
                $user ? `<user-id id=${$user.id} />` : "anonymous reader"
            }</span> / <span class="mention with-icon"><span class="material-symbols-outlined">account_circle</span> anonymous reader</span>`,
        ],
    ];

    let show_markdown = false;
    let show_features = false;

    onMount(() => setTimeout(() => highlight()));
</script>

<div class="container">
    <div id="main">
        <Navigation last={["/info/documentation", "Website Documentation"]}>
            <h1>Documents Feature Documentation</h1>
            <Linkable id="introduction" e="h2">Introduction</Linkable>
            <p>
                The TCN Docs feature allows you to create a markdown document that renders as a webpage. You can control access based on the reader's TCN
                Council position as well as insert some Discord-related components such as user mentions.
            </p>
            <p>
                To access this feature, go to <A href="/docs">/docs</A> (you can find this under
                <b>Staff Area &gt; Documents</b> if you are logged in as a council member).
            </p>
            <p>
                To create a new document, click "New Document" on the docs home page. You can also edit documents that you have edit access for if you have the
                edit link (<code>/forms/edit/:ID</code>).
            </p>
            <Linkable id="content" e="h2">Content</Linkable>
            <p>
                The first section is the name and the content, and both are required. Write out the document content in markdown (this is the same formatting
                system Discord uses). Here is a (nearly comprehensive) list of Markdown features:
            </p>
            <div class="scroll features">
                <div class="panel" style="width: max-content">
                    <h3 class="short row gap-1">
                        Markdown Reference
                        <A href={"javascript:void(0)"} on:click={() => (show_markdown = !show_markdown)}>
                            <i class="material-symbols-outlined">
                                {show_markdown ? "expand_less" : "expand_more"}
                            </i>
                        </A>
                    </h3>
                    <Show when={show_markdown}>
                        <table>
                            <tr>
                                <th>Markdown</th>
                                <th>Output</th>
                            </tr>
                            {#each cheat_sheet as [md, html]}
                                {@const list = Array.isArray(md) ? md : [md]}
                                <tr>
                                    <td style="padding: 20px">
                                        {#each list as item, index}
                                            {#if item.includes("<br />")}
                                                <pre class="bg-1">{@html item}</pre>
                                            {:else}
                                                {#if index !== 0}&nbsp;/&nbsp;{/if}<code class="bg-1">{item}</code>
                                            {/if}
                                        {/each}
                                    </td>
                                    <td style="padding: 20px">{@html html}</td>
                                </tr>
                            {/each}
                        </table>
                    </Show>
                </div>
            </div>
            <p>Here is a list of features specific to TCN Documents:</p>
            <div class="scroll features">
                <div class="panel" style="width: max-content">
                    <h3 class="short row gap-1">
                        Documents Features
                        <A href={"javascript:void(0)"} on:click={() => (show_features = !show_features)}>
                            <i class="material-symbols-outlined">
                                {show_features ? "expand_less" : "expand_more"}
                            </i>
                        </A>
                    </h3>
                    <Show when={show_features}>
                        <table>
                            <tr>
                                <th>Input</th>
                                <th>Output</th>
                            </tr>
                            {#each feature_list as [md, html]}
                                {@const list = Array.isArray(md) ? md : [md]}
                                <tr>
                                    <td style="padding: 20px">
                                        {#each list as item, index}
                                            {#if item.includes("<br />")}
                                                <pre class="bg-1">{@html item}</pre>
                                            {:else}
                                                {#if index !== 0}&nbsp;/&nbsp;{/if}<code class="bg-1">{item}</code>
                                            {/if}
                                        {/each}
                                    </td>
                                    <td style="padding: 20px">{@html html}</td>
                                </tr>
                            {/each}
                        </table>
                    </Show>
                </div>
            </div>
            <Linkable id="access" e="h2">Access</Linkable>
            <p>After writing the document content, you can control who has view and edit access to the document.</p>
            <ul>
                <li>Only you can edit the document's access permissions.</li>
                <li>Only you and observers can delete the document.</li>
                <li>Observers always have view access.</li>
            </ul>
            <ul>
                <li>Allow TCN Council - allow all TCN Council Members view access</li>
                <li>Allow Logged In Users - allow any user, but they must be logged in to view the document</li>
                <li>Allow Observers to Edit - observers will also be able to edit the document but not access permissions</li>
                <li>Allow TCN Council to Edit - allow all TCN Council Members to edit the document but not access permissions</li>
                <li>Make Public - allow everyone to view the document, even if they are not logged in</li>
                <li>Allowlist - you can allow specific users by ID</li>
            </ul>
            <Linkable id="appearance" e="h2">Appearance</Linkable>
            <p>
                Control the document's appearance here. You can set it to be anonymous to hide your name from the document, but observers will still be able to
                see who owns the document.
            </p>
            <p>
                Observers can designate a document as official, which modifies the notice at the top of the document. Usually, it informs the reader that the
                document is user-generated content and not endorsed by the TCN, but an official document as designated by the observer team. Use this
                responsibly!
            </p>
            <p>Finally, you can customize how the embed looks when the link is posted into Discord.</p>
        </Navigation>
    </div>
</div>

<style lang="scss">
    :global(.features blockquote) {
        margin-left: 0px;
        padding-left: 25px;
        border-left: 2px solid rgb(var(--text-2));
    }

    :global(.features .mention) {
        top: 0px;
    }

    :global(.features) {
        table,
        tr,
        th,
        td {
            border: 1px solid rgb(var(--text-2));
            border-collapse: collapse;
        }

        th,
        td {
            padding: 2px 5px;
        }
    }

    .scroll {
        overflow-x: scroll;
    }
</style>
