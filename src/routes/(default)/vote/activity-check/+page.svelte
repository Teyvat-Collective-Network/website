<script lang="ts">
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";

    export let data: { data: { id: number; display: string; voters: Record<string, boolean> }[] };

    function key(id: string) {
        let val = 0;

        for (const poll of data.data)
            if (id in poll.voters)
                if (poll.voters[id]) val = 0.8 * val;
                else val = 0.6 * val + 0.4;

        return val;
    }

    const ids = [...new Set(data.data.flatMap((x) => Object.keys(x.voters)))].sort((x, y) => key(y) - key(x));
</script>

<div class="container">
    <div style="overflow-x: scroll">
        <table>
            <tr>
                <td />
                {#each data.data as { id, display }}
                    <th style="cursor: default" title={display}>{id}</th>
                {/each}
            </tr>
            {#each ids as id}
                <tr>
                    <td><Mention><UserId {id} /></Mention></td>
                    {#each data.data as { voters }}
                        {@const status = id in voters ? (voters[id] ? 0 : 1) : 2}

                        <td style="cursor: default" title={["voted", "missing vote", "not eligible"][status]}>
                            <center>
                                {["✅", "❌", "-"][status]}
                            </center>
                        </td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
</div>

<style lang="scss">
    table {
        border-collapse: collapse;
    }

    td,
    th {
        padding: 5px;
    }

    tr:nth-child(even) {
        background-color: rgb(var(--invert-rgb), 10%);
    }
</style>
