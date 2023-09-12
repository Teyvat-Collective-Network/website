<script lang="ts">
    export let done: any = false;
</script>

{#if done}
    <slot />
{:else}
    <div id="loading" class="row gap-1">
        <svg width="40px" height="40px" viewBox="0 0 100 100">
            <circle id="outer" cx="50" cy="50" r="45" stroke="rgb(var(--text-accent))" fill="transparent" stroke-width="5px" />
            <circle id="inner" cx="50" cy="50" r="35" stroke="rgb(var(--text-accent), 60%)" fill="transparent" stroke-width="5px" />
        </svg>
        <span>Loading...</span>
    </div>
{/if}

<style lang="scss">
    @keyframes dash {
        to {
            transform: rotate(360deg);
        }
    }

    #outer {
        animation: dash 1.5s infinite cubic-bezier(0.6, 0.4, 0.4, 0.6);
        stroke-dasharray: 300;
        stroke-dashoffset: 200;
        transform-origin: center;
    }

    #inner {
        animation: dash 2.5s reverse infinite cubic-bezier(0.75, 0.25, 0.25, 0.75);
        stroke-dasharray: 220;
        stroke-dashoffset: 60;
        transform-origin: center;
    }

    #loading {
        font-size: 120%;
    }
</style>
