<script lang="ts">
    import Image from "$lib/components/Image.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import Timestamps from "$lib/components/Timestamps.svelte";

    let snowflake: string;
    let ms = false;

    $: time = snowflake?.match(/^[1-9][0-9]{16,19}$/) ? new Date(Number((BigInt(snowflake) >> 22n) + 1420070400000n)) : null;
</script>

<div class="container">
    <h1>Snowflakes</h1>
    <Modal button>
        <span slot="button">What are snowflakes?</span>
        <p>Snowflakes are Discord's ID format, which is taken from Twitter's. The ID contains four parts of information:</p>
        <ul>
            <li>
                <b>Timestamp:</b> Snowflakes inherently contain the timestamp of when it was created, which means you can determine the creation date of an object
                without needing to fetch it. Additionally, sorting items by snowflake will sort them chronologically.
            </li>
            <li><b>Worker ID:</b> The ID of the worker that handled the request that created this object.</li>
            <li><b>Process ID:</b> The ID of the process.</li>
            <li><b>Increment:</b> A value that increases every time an ID is generated on this process.</li>
        </ul>
        <br />
        <div class="col">
            <Image src="https://i.imgur.com/MsOpaaJ.png" alt="Snowflake Explanation" />
        </div>
    </Modal>
    <div class="container-tight">
        <h3 class="col">
            <input
                type="text"
                class="mono {snowflake?.match(/^[1-9][0-9]{16,19}$/) ? '' : 'error'}"
                placeholder="e.g. {new Array(Math.floor(Math.random() * 4) + 17)
                    .fill(0)
                    .map((x) => Math.floor(Math.random() * 10))
                    .join('')}"
                bind:value={snowflake}
            />
        </h3>
        <div class="panel">
            <h6 class="short text-2">{Intl.DateTimeFormat().resolvedOptions().timeZone} &mdash; Locale Format</h6>
            <Loading done={time}>
                <h2 class="short text-accent">
                    {time?.toLocaleString()}
                </h2>
            </Loading>
            <hr />
            <h6 class="short text-2">UNIX Timestamp ({ms ? "Milliseconds" : "Seconds"})</h6>
            <div class="row" style="justify-content: space-between">
                <Loading done={time}>
                    <h3 class="short">
                        {Math.floor((time?.getTime() ?? 0) / (ms ? 1 : 1000))}
                    </h3>
                </Loading>
                <div class="row gap-1">
                    Use MS
                    <Switch bind:on={ms} />
                </div>
            </div>
            <hr />
            <h6 class="short text-2">ISO 8601 Format</h6>
            <Loading done={time}>
                <h3 class="short mono">{time?.toISOString()}</h3>
            </Loading>
            <hr />
            <h6 class="short text-2">Discord Timestamp Formats</h6>
            <Loading done={time}>
                {#if time}
                    <Timestamps {time} />
                {/if}
            </Loading>
        </div>
    </div>
</div>
