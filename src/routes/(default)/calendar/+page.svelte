<script lang="ts" context="module">
    const weekdays = "Su Mo Tu We Th Fr Sa".split(" ");
    const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import EventModal from "$lib/components/EventModal.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Invite from "$lib/components/Invite.svelte";
    import Link from "$lib/components/Link.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { user } from "$lib/stores";
    import type { CalendarEvent } from "$lib/types";

    let open = -1;
    let sx = 0;

    const base = new Date();
    base.setHours(0);
    base.setMinutes(0);
    base.setSeconds(0);
    base.setMilliseconds(0);

    let x = new Date();
    setInterval(() => (x = new Date()), 1000);

    const dates = [...new Array(60).keys()].map((x) => {
        const k = new Date();
        k.setDate(k.getDate() + x - 3);
        return k;
    });

    const f = (e: any) => (sx = e.target.scrollLeft);

    const tracks: CalendarEvent[][] = [];
    const last: number[] = [];

    for (const event of ($page.data.events as CalendarEvent[]).sort((x, y) => x.start - y.start)) {
        if (tracks.length === 0) {
            tracks.push([]);
            last.push(-1);
        }

        let inserted = false;
        for (let index = 0; index < tracks.length; index++) {
            if (last[index] <= event.start) {
                tracks[index].push(event);
                last[index] = event.end;
                inserted = true;
                break;
            }
        }

        if (inserted) continue;
        tracks.push([event]);
        last.push(event.end);
    }
</script>

<div class="container">
    <h3 class="row gap-1">
        Events &amp; Other Dates
        {#if $user?.council}
            <Link to="/calendar/edit/new"><Icon icon="add" /></Link>
        {/if}
    </h3>

    <div id="calendar-box" class="bg-2 round" on:scroll={f}>
        <div id="calendar" class="col no-center gap-05 round">
            {#each tracks as track}
                <div class="track">
                    {#each track as event}
                        {@const x = (event.start - base.getTime()) / 86400000 + 3}
                        {@const y = (event.end - event.start) / 86400000}
                        <button class="event row round" style="left: {x * 55}px; width: {55 * y - 15}px" on:click={() => (open = event.id)}>
                            <div style="padding-left: calc({sx}px - {x * 55 + 20}px)">{event.title}</div>
                        </button>
                        <EventModal {event} open={open === event.id} on:close={() => (open = -1)} />
                    {/each}
                </div>
            {/each}

            {#each dates as d, i}
                <div class="vline col no-wrap dateline" style="left: {i * 55 + 17}px">
                    <span class="plain less">
                        {#if d.getDate() === 1}
                            <b>{months[d.getMonth()]}</b>
                        {:else}
                            {weekdays[d.getDay()]}
                        {/if}
                    </span>

                    <span class="plain more">{d.getDate()}</span>
                </div>
            {/each}

            <div class="vline col no-wrap timeline" style="left: {179 + ((x.getTime() - base.getTime()) / 86400000) * 55}px">
                <span class="plain bg-1">
                    {x.getHours()}:{x.getMinutes().toString().padStart(2, "0")}:{x.getSeconds().toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    #calendar-box {
        overflow-x: scroll;
        padding: 90px 20px 20px 20px;
        position: relative;
        width: 100%;
    }

    #calendar {
        width: calc(50px * 59 + 5px * 58);
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgb(var(--bg-1));
        border-radius: 5px;
        border: 4px solid rgb(var(--bg-2));
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: rgb(var(--bg-0));
    }

    .track {
        height: 50px;
        position: relative;
    }

    .event {
        background-color: rgb(var(--bg-4));
        cursor: pointer;
        font-size: 80%;
        font-weight: 400;
        height: 40px;
        padding: 5px;
        position: absolute;
        width: calc(100% - 10px);
        z-index: 1;

        & > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &:hover {
            background-color: rgb(var(--bg-3));
        }
    }

    .vline {
        bottom: 0;
        line-height: 16px;
        pointer-events: none;
        position: absolute;
        top: 0;
    }

    .dateline {
        background-color: rgb(var(--invert-rgb), 15%);
        padding-top: 35px;
        width: 1px;

        & > span {
            font-size: 16px;
            height: 20px;
            padding: 0;
        }
    }

    .timeline {
        background-color: rgb(var(--accent), 75%);
        width: 3px;
        z-index: 2;

        & > span {
            border-radius: 3px;
            font-size: 16px;
            height: 20px;
            margin-top: 4px;
            padding: 5px 4px 0 4px;
        }
    }

    .less {
        opacity: 40%;
    }

    .more {
        opacity: 80%;
    }
</style>
