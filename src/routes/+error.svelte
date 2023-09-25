<script>
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Layout from "$lib/components/Layout.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
</script>

<Layout>
    <div class="container">
        <h1><b>{$page.status}</b> {$page.error?.message}</h1>
        <p>
            If you believe this is our fault, please open an issue on GitHub
            <A to="https://github.com/Teyvat-Collective-Network/website/issues" external>here</A> or contact
            <Mention><UserId id="251082987360223233" /></Mention> on Discord.
        </p>
        <p>
            <LinkButton to="/">Home</LinkButton>
        </p>
    </div>
</Layout>
