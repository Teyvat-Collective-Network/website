<script lang="ts">
    import { page } from "$app/stores";
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import OneTimeMessage from "$lib/components/OneTimeMessage.svelte";

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

    let dismiss: any;
</script>

<div id="main" class="container gap-2">
    <h1>Our Partners</h1>
    <OneTimeMessage id="not-unique" bind:dismiss>
        <div class="wide">
            <Callout style="info">
                <p>
                    Already see your server's character here? Don't worry &mdash; we don't require servers to represent unique characters, so feel free to
                    apply!
                </p>
                <p>
                    <button on:click={dismiss}>Dismiss</button>
                </p>
            </Callout>
            <br />
        </div>
    </OneTimeMessage>
    <div id="searchbar" class="wide row no-wrap gap-2">
        <Icon icon="search" />
        <input type="text" bind:value={query} placeholder="Filter Servers" />
    </div>
    <div class="external panel wide row no-wrap gap-4 {fuzzy('genshin wizard', query) ? '' : 'hidden'}">
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
    <div class="external panel wide row no-wrap gap-4 {fuzzy('genshin impact tavern', query) ? '' : 'hidden'}">
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
            <div class="col">
                <img src="/files/{mascot}.png" alt="{name} Icon" width="150px" height="150px" />
                <A to="/server/{id}"><h4>{name}</h4></A>
                <LinkButton to="https://discord.gg/{invite}" external>Join</LinkButton>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    #main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    }

    h1,
    .wide {
        grid-column: 1 / -1;
    }

    #searchbar {
        margin-bottom: 40px;
    }

    .panel {
        margin: 0;
    }

    .external {
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
