<script lang="ts">
    import { alerts } from "$lib/stores";
    import { onMount } from "svelte";

    const { copy } = alerts;

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let now = new Date();
    let mounted = false;

    onMount(() => {
        mounted = true;

        setTimeout(() => ((now = new Date()), setInterval(() => (now = new Date()), 1000)), 1000 - (Date.now() % 1000));

        setTimeout(() => {
            document.querySelectorAll("code").forEach((e) =>
                e.addEventListener("click", (event) => {
                    navigator.clipboard.writeText(new DOMParser().parseFromString((event.target as any).innerHTML, "text/html").documentElement.textContent!);
                    copy.update((x) => x + 1);
                    setTimeout(() => copy.update((x) => x - 1), 1500);
                }),
            );
        });
    });

    function rel(diff: number) {
        diff = Math.round(diff / 1000);

        if (diff < 2) return "a few seconds";

        if (diff < 60) return `${diff} seconds`;
        diff = Math.round(diff / 60);

        if (diff === 1) return "a minute";
        if (diff < 60) return `${diff} minutes`;
        diff = Math.round(diff / 60);

        if (diff === 1) return "an hour";
        if (diff < 24) return `${diff} hours`;
        diff = Math.round(diff / 24);

        if (diff === 1) return "a day";
        if (diff <= 25) return `${diff} days`;

        const md = Math.round(
            Math.abs((time.getFullYear() - now.getFullYear()) * 12 + (time.getMonth() - now.getMonth()) + (time.getDate() - now.getDate()) / 31),
        );

        if (md === 1) return "a month";
        if (md <= 10) return `${md} months`;

        const yd = Math.abs(time.getFullYear() - now.getFullYear());
        return yd === 1 ? "a year" : `${yd} years`;
    }

    let year: number | "" = "",
        month: number | "" = "",
        date: number | "" = "",
        hour: number | "" = "",
        minute: number | "" = "",
        second: number | "" = "";

    $: time = year !== "" && month !== "" && date !== "" ? new Date(year, month - 1, date, hour || 0, minute || 0, second || 0) : now;
    $: ts = time.getTime();

    $: datestring = `${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;
    $: timestring = `${time.getHours() % 12 || 12}:${time.getMinutes().toString().padStart(2, "0")} ${time.getHours() >= 12 ? "PM" : "AM"}`;
    $: formats = mounted
        ? [
              ["", `${datestring} ${timestring}`],
              ["D", datestring],
              ["d", time.toLocaleDateString()],
              ["F", `${weekdays[time.getDay()]}, ${datestring} ${timestring}`],
              ["f", `${datestring} ${timestring}`],
              ["R", `${time > now ? "in " : ""}${rel(Math.abs(ts - now.getTime()))}${time > now ? "" : " ago"}`],
              [
                  "T",
                  `${time.getHours() % 12 || 12}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")} ${
                      time.getHours() >= 12 ? "PM" : "AM"
                  }`,
              ],
              ["t", timestring],
          ]
        : [];
</script>

<div class="container">
    <h1>Timestamp Generator</h1>
    <div class="gap-1" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100px, 100%), 1fr))">
        <input type="text" inputmode="numeric" placeholder="Year" bind:value={year} />
        <input type="text" inputmode="numeric" placeholder="Month" bind:value={month} />
        <input type="text" inputmode="numeric" placeholder="Date" bind:value={date} />
        <input type="text" inputmode="numeric" placeholder="Hour" bind:value={hour} />
        <input type="text" inputmode="numeric" placeholder="Minute" bind:value={minute} />
        <input type="text" inputmode="numeric" placeholder="Second" bind:value={second} />
    </div>
    <br />
    <p>Click a code block to copy.</p>
    <div class="gap-1" style="display: grid; grid-template-columns: auto auto 1fr; align-items: center">
        {#each formats as [key, string]}
            <span>
                <code>&lt;t:{Math.floor(ts / 1000)}{key ? `:${key}` : ""}&gt;</code>
            </span>
            <span>&mdash;</span>
            <time datetime={`${ts}`}>{string}</time>
        {/each}
    </div>
</div>

<style lang="scss">
    code {
        cursor: pointer;
        outline: 1px solid rgb(var(--invert-rgb), 10%);
    }
</style>
