<script lang="ts" context="module">
    function mod(x: number, m: number) {
        return ((x % m) + m) % m;
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import FixedButton from "./FixedButton.svelte";

    let canvas: HTMLCanvasElement;
    let show = false;
    let loaded = false;

    let snowflakes: [number, number, number, number][] = [];

    onMount(() => {
        const ctx = canvas.getContext("2d")!;
        if (!ctx) return;

        show = true;
        loaded = true;

        let backoff = 0;
        let chanceOfWind = 0;
        let windLevel = 0;
        let windAccel = 0;
        let windDuration = 0;
        let windLockout = 0;
        let last = 0;

        function iterate() {
            if (!show) {
                if (backoff++ > 25) return requestAnimationFrame(iterate);
            } else if (backoff) {
                backoff = 0;
                for (const flake of snowflakes) flake[1] = -Math.random() * canvas.height;
            }

            if (windDuration > 0) {
                windLevel += windAccel * Math.random() * 0.01;
                windDuration--;
                if (windDuration <= 0) windLockout = 500;
            } else {
                if (windLockout === 0 && Math.random() < chanceOfWind) {
                    windAccel = Math.random() - 0.5;
                    windDuration = Math.random() * 250 + 250;
                    chanceOfWind = 0;
                } else {
                    if (windLockout > 0) windLockout--;
                    else chanceOfWind += 0.001;

                    windLevel *= 0.99;
                }
            }

            ctx.fillStyle = "#88888833";

            for (const flake of snowflakes) {
                flake[0] += flake[3] + windLevel;
                flake[1] += flake[2];
                flake[2] = Math.min(0.3, Math.max(0.1, flake[2] + Math.random() * 0.01 - 0.005));
                flake[3] += Math.random() * 0.001 - 0.0005;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const [x, y] of snowflakes) {
                ctx.fillRect(mod(x, canvas.width), mod(y, canvas.height), 1, 1);
            }

            const threshold = Math.floor((canvas.width * canvas.height) / 600);

            if (last !== threshold) {
                last = threshold;

                while (snowflakes.length < threshold)
                    snowflakes.push([Math.random() * canvas.width, -Math.random() * canvas.height, Math.random() * 0.1 + 0.05, Math.random() * 0.05 - 0.025]);

                if (snowflakes.length > threshold) snowflakes.splice(threshold);
            }

            requestAnimationFrame(iterate);
        }

        iterate();
    });

    let width: number, height: number;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<canvas bind:this={canvas} width={width / 6} height={height / 6} style="opacity: {show ? 1 : 0}" />

{#if loaded}
    <FixedButton
        always
        icon="ac_unit"
        click={() => (show = !show)}
        index={1}
        backgroundColor={show ? "rgb(var(--text-accent))" : "rgb(var(--bg-4))"}
        color={show ? "rgb(var(--pure-rgb))" : "rgb(var(--invert-rgb))"}
    />
{/if}

<style lang="scss">
    canvas {
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        transition: opacity 250ms;
    }
</style>
