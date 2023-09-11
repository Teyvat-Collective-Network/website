<div class="container">
    <div id="left">
        <img src="/favicon.png" alt="Icon" width="80px" />
        <span id="title">Teyvat Collective Network</span>
    </div>
    <div id="links">
        <a class="text-1" href="/">Home</a>
        <a class="text-1" href="/about">About</a>
        <a class="text-1" href="/partners">Partners</a>
        <a id="join" class="accent-button text-1" href="/join">Apply Now</a>
    </div>
</div>

<style lang="scss">
    .container,
    #left,
    #links {
        align-items: center;
        display: flex;
        flex-direction: row;
        padding-top: 1em;
    }

    #left,
    #links {
        gap: 1.5em;
    }

    .container {
        justify-content: space-between;
        padding-bottom: 2em;
    }

    @media screen and (max-width: 800px) {
        #links {
            display: none;
        }
    }

    #title {
        font-size: 150%;
        font-weight: 500;
    }

    a {
        font-weight: 400;
        text-decoration: none;
        transition: border-bottom 200ms, color 200ms, background-color 200ms;

        &#join {
            border-radius: 5px;
            padding: 0.5em 1em;

            &:hover {
                background-color: rgb(var(--accent-less));
            }
        }

        &:not(#join) {
            border-bottom: 3px solid transparent;

            &:hover {
                border-color: rgb(var(--accent));
                color: rgb(var(--accent));
            }
        }
    }
</style>
