<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";

    let query = "";

    function fuzzy(string: string, query: string): boolean {
        const lower = query.toLowerCase();
        string = string.toLowerCase();

        let index = 0;
        for (const char of lower) {
            if ((index = string.indexOf(char, index)) === -1) return false;
            index++;
        }

        return true;
    }
</script>

<div id="main" class="container">
    <h1>Our Partners</h1>
    <div id="searchbar" class="wide">
        <Icon icon="search" />
        <input type="text" bind:value={query} placeholder="Filter Servers" />
    </div>
    <div class="external panel wide {fuzzy('genshin wizard', query) ? '' : 'hidden'}">
        <img
            src="https://genshinwizard.com/wp-content/uploads/2022/09/cropped-genshinwizard_logo-192x192.png"
            alt="Genshin Wizard Icon"
            width="192"
            height="192"
        />
        <div>
            <h3>Genshin Wizard</h3>
            <p>The TCN is partnered with Genshin Wizard, a multi-purpose Genshin Impact utility bot. Check out their website below!</p>
            <LinkButton to="https://genshinwizard.com" external>Website</LinkButton>
        </div>
    </div>
    <div class="external panel wide {fuzzy('genshin impact tavern', query) ? '' : 'hidden'}">
        <img src="https://i.imgur.com/pwzRnxW.png" alt="Genshin Impact Tavern Icon" width="192" height="192" />
        <div>
            <h3>Genshin Impact Tavern</h3>
            <p>
                The TCN is partnered with Genshin Impact Tavern, a multifaceted Discord Community Server for Genshin Impact! Check out their RPG-like experience
                through a custom bot, which lets you earn Mora that can be used to redeem official merchandise, their Cat's Tail Gathering TCG tournament, and
                more! <i>Genshin Impact Tavern is an officially endorsed server.</i>
            </p>
            <LinkButton to="https://discord.gg/genshinimpacttavern" external>Join</LinkButton>
        </div>
    </div>
    {#each $page.data.partners as { id, name, mascot, invite }}
        <div class="panel {fuzzy(name, query) || fuzzy(mascot, query) ? '' : 'hidden'}">
            <div class="partner">
                <div class="top">
                    <img src="/images/characters/{mascot}.png" alt="{name} Icon" width="150px" height="150px" />
                    <Link to="/server/{id}"><b>{name}</b></Link>
                </div>
                <div class="row">
                    <LinkButton to="https://discord.gg/{invite}" external>Join</LinkButton>
                </div>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    #main {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    }

    h1,
    .wide {
        grid-column: 1 / -1;
    }

    #searchbar {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 20px;
        margin-bottom: 40px;
    }

    .panel {
        margin: 0;
    }

    .external {
        align-items: center;
        display: flex;
        flex-direction: row;
        gap: 40px;
        padding: 20px 40px;

        & > div {
            align-items: flex-start;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 20px 0;

            & > h3 {
                margin: 0;
            }
        }

        @media screen and (max-width: 600px) {
            flex-direction: column;
        }
    }

    .hidden {
        position: fixed;
        width: 0;
        height: 0;
        top: 100vh;
        left: 100vw;
        opacity: 0;
        pointer-events: none;
    }
</style>
