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
    <h1>Our Member Servers</h1>
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
    <p class="wide">The network is also partnered with a few third-party organizations offering mutual benefits! Check them out here!</p>
    <div class="wide">
        <LinkButton to="/external-partners">External Partners</LinkButton>
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
