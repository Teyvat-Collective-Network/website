<script lang="ts" context="module">
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
</script>

<script lang="ts">
    export let value: Date | string | undefined;
    export let mode: "date" | "time" | "datetime" = "datetime";

    const show_date = mode !== "time";
    const show_time = mode !== "date";

    if (typeof value === "string") value = new Date(value);

    let year: number | undefined = value?.getFullYear();
    let month: number | undefined = value?.getMonth();
    let date: number | undefined = value?.getDate();
    let hour: number | undefined = value?.getHours();
    let minute: number | undefined = value?.getMinutes();

    const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    $: (lengths[1] = year == undefined || (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28),
        month === 1 ? (date &&= Math.min(date, lengths[1])) : null;

    let offset = 0;
    $: offset = year == undefined || month == undefined ? 0 : (new Date(year, month, 1).getDay() + 6) % 7;

    $: value =
        (!show_date || (year != undefined && month != undefined && date != undefined)) && (!show_time || (hour != undefined && minute != undefined))
            ? new Date(year ?? 1970, month ?? 0, date ?? 1, hour ?? 0, minute ?? 0, 0)
            : undefined;
</script>

<div class="row gap-1">
    <span class="row gap-05">
        {#if show_date}
            <input type="number" placeholder="Y" class="long {year == undefined ? 'error' : ''}" bind:value={year} />
            <select class={month === -1 ? "error" : ""} bind:value={month}>
                <option selected disabled hidden value={-1}>M</option>
                {#each months as name, index}
                    <option value={index}>{name}</option>
                {/each}
            </select>
            <input
                type="number"
                placeholder="D"
                class="short {date == undefined || date > lengths[month ?? 0] ? 'error' : ''}"
                min={1}
                max={lengths[month ?? 0]}
                bind:value={date}
            />
        {/if}
    </span>
    <span class="row">
        {#if show_time}
            <input
                type="number"
                id="hour"
                placeholder="H"
                class="short {hour == undefined || hour < 0 || hour > 23 ? 'error' : ''}"
                min={0}
                max={23}
                bind:value={hour}
            />
            <b>&nbsp;:&nbsp;</b>
            <input
                type="number"
                id="minute"
                placeholder="M"
                class="short {minute == undefined || minute < 0 || minute > 59 ? 'error' : ''}"
                min={0}
                max={59}
                bind:value={minute}
            />
        {/if}
    </span>
</div>

<style lang="scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

    .error {
        box-shadow: 2px 2px 1px rgb(var(--red-text));
    }

    .short {
        width: 32px;
    }

    .long {
        width: 80px;
    }
</style>
