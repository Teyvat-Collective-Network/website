<script lang="ts">
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/discord#webhooks-embeds", "Discord Help"]}>
        <h1>Webhooks</h1>
        <Linkable e="h2" id="what-is-a-webhook">What is a webhook?</Linkable>
        <p>
            A webhook is a resource that you can create in a text channel that anyone with the URL can use to post messages to the channel. Webhooks are
            identified by their URL, which is private and required to use the webhook.
        </p>
        <Callout style="red">
            <p>
                <b>Keep your webhook URL private.</b> Anyone with the URL can use it to post messages and there is no way to identify who uses a webhook.
                Webhooks can sometimes also ping <Mention>everyone</Mention>, making this especially important.
            </p>
        </Callout>
        <Linkable e="h2" id="creating">How do I create a webhook?</Linkable>
        <p>
            Go to <b>channel settings</b> and click "Integrations". You should see a "Create Webhook" button. Click it to get a new webhook with a default name and
            blank profile picture, You can change these if you would like and click "Save". When messages are sent, they will appear with this profile picture and
            name.
        </p>
        <Linkable e="h2" id="usage">How do I use a webhook?</Linkable>
        <p>In the <b>channel settings</b> tab, click on a webhook to expand it, then click "Copy Webhook URL". <b>Keep this URL private.</b></p>
        <p>Now, you can paste it into an embed utility, execute it manually, use it in a <A to="/forms">TCN form</A>, etc.</p>
        <Linkable e="h2" id="advanced">Advanced Usage</Linkable>
        <p>
            By default, when you execute a webhook, the message will be posted to the channel itself with the webhook's avatar and name. You can actually do a
            bit more. Note that not all of these features are available with all of the listed services.
        </p>
        <ul>
            <li>You can edit a message that was sent by the same webhook using the message ID.</li>
            <li>You can post the message to a thread with the thread ID.</li>
            <li>In forum channels, you can create a new post with a specified thread name. Otherwise, you must specify the post ID.</li>
            <li>
                You can set the avatar and name for a specific message when posting. This overrides the defaults for that message alone. If a webhook sends two
                messages in a row with the same username, they merge together like with user messages.
                <ul>
                    <li>You cannot edit the avatar or name later on.</li>
                </ul>
            </li>
        </ul>
        <Linkable e="h2" id="services">Services</Linkable>
        <Linkable e="h3" id="tcn">TCN Embed Tool</Linkable>
        <A to="/tools/embeds" external>{PUBLIC_DOMAIN}/tools/embeds</A>
        <p>
            The TCN Embed Tool has an example on the landing page. This is a TOML-based message editor that isn't the most convenient to use but is rigorously
            defined, allows for a much more readable text representation than raw JSON, and is the basis for autosync templates.
        </p>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> New Forum Posts</div>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> Post To Threads</div>
        <div class="row gap-1"><Icon icon="clear" class="red-text" /> Components (Buttons &amp; Select Menus)</div>
        <br />
        <Callout style="red">
            <p>
                <b>Careful!</b> TCN Embed Tool's share links expire after one week of not being accessed. If you want to keep a permanent link, copy-paste the
                link from the browser bar and shorten it using something like <A to="https://tinyurl.com" external>TinyURL</A>.
            </p>
        </Callout>
        <Linkable e="h3" id="tcn">Leaf Embeds</Linkable>
        <A to="https://embeds.leaf.moe" external>https://embeds.leaf.moe</A>
        <p>Leaf Embeds does not have any documentation, but you can check out <A to="https://embeds.leaf.moe/demo" external>this example</A> for a demo.</p>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> New Forum Posts</div>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> Post To Threads</div>
        <div class="row gap-1"><Icon icon="clear" class="red-text" /> Components (Buttons &amp; Select Menus)</div>
        <br />
        <Callout style="info">
            <p>Leaf Embeds' save links last forever and have the added bonus of being editable.</p>
        </Callout>
        <Linkable e="h3" id="discohook">Discohook</Linkable>
        <A to="https://discohook.org" external>https://discohook.org</A>
        <p>Discohook has usage instructions in the landing page.</p>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> New Forum Posts</div>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> Post To Threads</div>
        <div class="row gap-1"><Icon icon="clear" class="red-text" /> Components (Buttons &amp; Select Menus)</div>
        <br />
        <Callout style="red">
            <p>
                <b>Careful!</b> Discohook's share links expire after one week. If you want to keep a permanent link, copy-paste the link from the browser bar
                and shorten it using something like <A to="https://tinyurl.com" external>TinyURL</A>.
            </p>
        </Callout>
        <Linkable e="h3" id="embed-generator">Embed Generator</Linkable>
        <A to="https://message.style" external>https://message.style</A>
        <p>Embed Generator has its own help page and FAQ on the left sidebar.</p>
        <div class="row gap-1"><Icon icon="clear" class="red-text" /> New Forum Posts</div>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> Post To Threads</div>
        <div class="row gap-1"><Icon icon="check" class="green-text" /> Components (Buttons &amp; Select Menus)</div>
        <Linkable e="h2" id="developers">For Developers</Linkable>
        <p>
            A webhook is just an endpoint to which you can send data to make the webhook perform certain actions. You can find full documentation on the
            <A to="https://discord.com/developers/docs/resources/webhook">Developer Portal</A>, but here is a summary:
        </p>
        <ul>
            <li>
                <code>POST /</code> &mdash; Provide the message data as the body to post your message through the webhook. Most embed creation services have a
                JSON editor which allows you to copy the JSON data of your message.
                <ul>
                    <li>To receive the created message object as a response, set <code>?wait=true</code>.</li>
                    <li>To post to a thread, set <code>?thread_id=...</code>.</li>
                    <li>To create a new forum post, set <code>"thread_name": "..."</code> in the request body.</li>
                </ul>
            </li>
            <li><code>PATCH /messages/:id</code> &mdash; Edit a webhook message.</li>
            <li><code>DELETE /messages/:id</code> &mdash; Delete a webhook message.</li>
            <li>
                <code>PATCH /</code> &mdash; Edit the <code>name</code> and/or <code>avatar</code> of the webhook. You cannot change which channel the webhook is
                in using the method.
            </li>
            <li><code>DELETE /</code> &mdash; <b class="red-text">Delete the webhook.</b></li>
        </ul>
    </Navigation>
</div>
