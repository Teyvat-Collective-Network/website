<script>
    import Layout from "$lib/components/Layout.svelte";
    import SecretSantaSnowOverlay from "$lib/components/SecretSantaSnowOverlay.svelte";
</script>

<SecretSantaSnowOverlay />

<Layout
    title="TCN Secret Santa"
    description="Happy Holidays! Join the TCN's network-wide secret santa event to celebrate the spirit of giving! Visit this webpage for more information."
    hideSecretSantaMessage
>
    <div class="container">
        <slot />
    </div>
</Layout>
