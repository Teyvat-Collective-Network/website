<script lang="ts">
    import LinkButton from "../../../lib/components/LinkButton.svelte";
</script>

<div id="main" class="container gap-2">
    <h1>Our External Partners</h1>
    <p>
        These organizations are partnered with us and are not members of the network. Partners are decided by a majority vote of all network members. To view
        the list of our member servers, visit the link below!
    </p>
    <div class="mb-4">
        <LinkButton to="/members">TCN Members</LinkButton>
    </div>
    <div class="external panel row no-wrap gap-4">
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
    <div class="external panel row no-wrap gap-4">
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
</div>

<style lang="scss">
    .mb-4 {
        margin-bottom: 1rem;
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
</style>
