<script lang="ts">
    import api from "$lib/api";
    import { token } from "$lib/stores";
    import { debounce } from "$lib/utils";
    import { onMount } from "svelte";
    import LinkButton from "./LinkButton.svelte";
    import Loading from "./Loading.svelte";
    export let invite: string;

    let banner = "";
    let icon = "";
    let title = "";

    let done = false;

    async function load() {
        done = false;

        const req = await fetch(`/api/invite/${encodeURIComponent(invite)}`);

        if (!req.ok) return;
        const data = await req.json();

        const greq = await api($token, `!GET /guilds/${data.guild.id}`);
        if (greq.ok) title = (await greq.json()).name;

        banner = data.guild.splash
            ? `https://cdn.discordapp.com/splashes/${data.guild.id}/${data.guild.splash}.webp?size=1024`
            : `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.webp?size=1024`;
        icon = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.webp?size=256`;
        title ||= data.guild.name;

        done = true;
    }

    onMount(load);

    $: invite, debounce(load)();
</script>

<Loading {done} text="<tcn-link to='https://discord.gg/{invite}'>discord.gg/{invite}</tcn-link>">
    <div id="invite" class="round">
        {#if banner}
            <div id="banner" style="background-image: url({banner})" />
        {:else}
            <div id="banner" style="background-color: rgb(var(--pure-rgb, 50%))" />
        {/if}
        <img src={icon} alt="icon" id="icon" />
        <b id="title">{title}</b>
        <div id="join">
            <LinkButton to="https://discord.gg/{invite}" external>JOIN</LinkButton>
        </div>
    </div>
</Loading>

<style lang="scss">
    #invite {
        align-items: center;
        background-color: rgb(var(--pure-rgb, 50%));
        display: grid;
        gap: 1em;
        grid-template-areas: "a a a" "b c d";
        grid-template-columns: 1fr 5fr 1fr;
        grid-template-rows: 3fr 2fr;
        width: min(100%, max(40%, 400px));
    }

    #banner {
        background-position: center;
        background-size: cover;
        border-radius: 5px 5px 0 0;
        grid-area: a;
        height: 100%;
    }

    #icon {
        border-radius: 10px;
        grid-area: b;
        margin: 0 0 1em 1em;
        max-width: 100%;
    }

    #title {
        grid-area: c;
        padding: 0 0 1em 1em;
    }

    #join {
        grid-area: d;
        margin: 0 1em 1em 0;
    }
</style>
