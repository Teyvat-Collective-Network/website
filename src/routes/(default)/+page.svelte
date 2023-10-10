<script lang="ts">
    import api from "$lib/api";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { token } from "$lib/stores";
    import { onMount } from "svelte";

    let guilds = -1;

    onMount(async () => {
        const stats = await api($token, "GET /stats").catch();
        guilds = stats?.guilds ?? -1;
    });
</script>

<div class="container">
    <div id="tiles">
        <div id="top-left" class="panel">Welcome to the Teyvat Collective Network (TCN)!</div>
        <div id="top-right" class="panel highlight">
            The mission of the TCN is to unite all mains servers across Teyvat and provide support and promote collaboration between partners.
        </div>
        <div id="bottom-left" class="panel">
            The TCN is a network of {guilds === -1 ? "??" : guilds} high-quality Genshin Impact Discord servers that are dedicated to fostering Mains-style fan communities.
        </div>
        <div id="bottom-right" class="panel">
            Do you own a Discord server dedicated to a playable Genshin Impact character and want to join the TCN? Apply here!
            <LinkButton id="join" to="/join">Apply To Join</LinkButton>
        </div>
    </div>
</div>

<style lang="scss">
    #tiles {
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(10, 1fr);

        & > .panel {
            align-items: center;
            display: flex;
            margin: 0;
            padding: 1.5em;

            &:not(#bottom-right) {
                flex-direction: row;
            }
        }
    }

    @media screen and (min-width: 1200px) {
        #top-left {
            grid-column: 1 / 5;
        }

        #top-right {
            grid-column: 5 / 11;
        }

        #bottom-left {
            grid-column: 1 / 6;
        }

        #bottom-right {
            grid-column: 6 / 11;
        }
    }

    @media screen and (max-width: 1199px) {
        #tiles > .panel {
            grid-column: 1 / 11;
        }
    }

    #top-left {
        font-size: 200%;
        font-weight: 600;
        line-height: 120%;
    }

    #top-right {
        font-size: 150%;
        font-weight: 400;
        line-height: 150%;
    }

    #bottom-left {
        font-size: 125%;
        line-height: 175%;
    }

    #bottom-right {
        flex-direction: column;
        font-size: 125%;
        gap: 1em;
        line-height: 175%;
    }

    :global(#join) {
        font-weight: 400;
    }
</style>
