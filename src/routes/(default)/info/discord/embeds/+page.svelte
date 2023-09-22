<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/discord#webhooks-embeds", "Discord Help"]}>
        <h1>Embeds</h1>
        <Linkable e="h2" id="embed-color">Embed Color</Linkable>
        <p>
            You should pick an embed color that you like and stick to it for most or all of your embeds for consistency and organization. If you want embeds to
            appear colorless, use <code>#2b2d31</code> (dark mode).
        </p>
        <Linkable e="h2" id="text-color">Text Color</Linkable>
        <p>
            You cannot color text by default, but you can use code block syntax highlighting to get a similar effect. Refer to
            <A to="https://docs.google.com/document/d/1tyBtgNfGc6ae7t033dFxdqCSfG9kgiuwrFxlJTvyuu8/edit">this document</A> for a list of some possibilities.
        </p>
        <Linkable e="h2" id="timestamps">Timestamps</Linkable>
        <p>
            Discord does not make it obvious that this feature exists, but you can show a specific date to a user both in absolute and relative time. Absolute
            time will appear in the user's local timezone. The format is <code>&lt;t:timestamp:format&gt;</code>. You can use
            <A to="https://discord-timestamp-generator.vercel.app/" external>this tool</A> to generate these.
        </p>
        <Linkable e="h2" id="limits">Embed Limits</Linkable>
        <p>Discord places the following limits on embeds:</p>
        <ul>
            <li>The sum of all text in the following fields within one message cannot exceed 6000 characters.</li>
            <li><b>Author Name:</b> 256 characters</li>
            <li><b>Title:</b> 256 characters</li>
            <li><b>Description:</b> 4096 characters</li>
            <li><b>Field Names:</b> 256 characters and mandatory</li>
            <li><b>Field Values:</b> 1024 characters and mandatory</li>
            <li><b>Footer Text:</b> 2048 characters and no markdown support</li>
            <li>A message may have up to 10 embeds.</li>
            <li>An embed may have up to 25 fields.</li>
        </ul>
    </Navigation>
</div>
