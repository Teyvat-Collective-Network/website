<script>
    import { page } from "$app/stores";
    import Icon from "$lib/components/Icon.svelte";
    import Layout from "$lib/components/Layout.svelte";
    import Link from "$lib/components/Link.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
</script>

<Layout>
    <div class="container">
        <h1><b>{$page.status}</b> {$page.error?.message}</h1>
        <p>
            If you believe this is our fault, please open an issue on GitHub
            <Link to="https://github.com/Teyvat-Collective-Network/website/issues" external>here</Link> or contact
            <span class="mention with-icon"><Icon icon="alternate_email" /> hyperneutrino</span> on Discord.
        </p>
        <p>
            <LinkButton to="/">Home</LinkButton>
        </p>
    </div>
</Layout>
