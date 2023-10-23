<script lang="ts">
    import Timestamps from "$lib/components/Timestamps.svelte";

    let now = new Date();

    let year: number | "" = "",
        month: number | "" = "",
        date: number | "" = "",
        hour: number | "" = "",
        minute: number | "" = "",
        second: number | "" = "";

    $: time = year !== "" && month !== "" && date !== "" ? new Date(year, month - 1, date, hour || 0, minute || 0, second || 0) : now;
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
    <Timestamps {time} bind:now />
</div>
