<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Callout from "$lib/components/Callout.svelte";
    import { patterns } from "$lib/utils";

    export let form: any;
    let advisor = form?.advisor ?? "";
</script>

<b><A to="/admin/api-manager">Return to main page</A></b>
<br /><br />
<hr />
<h3>Creating Guild</h3>
{#if form?.error}
    <Callout style="red">
        <p>{@html form.error}</p>
    </Callout>
    <br />
{/if}
<form method="post">
    <div id="content">
        <label for="id"><b>Guild ID</b></label>
        <input type="text" name="id" required pattern={patterns.snowflake} value={form?.id ?? ""} />
        <label for="name"><b>Name</b></label>
        <input type="text" name="name" required maxlength={64} value={form?.name ?? ""} />
        <label for="mascot">Mascot ID</label>
        <input type="text" name="mascot" required pattern={patterns.id} value={form?.mascot ?? ""} />
        <label for="invite">Invite Code</label>
        <input type="text" name="invite" required value={form?.invite ?? ""} />
        <label for="owner">Owner ID</label>
        <input type="text" name="owner" required pattern={patterns.snowflake} value={form?.owner ?? ""} />
        <label for="advisor">Advisor ID</label>
        <input type="text" name="advisor" pattern={patterns.snowflake} bind:value={advisor} />
        <label for="reason"><b>Audit Log Reason</b></label>
        <input type="text" name="reason" maxlength={256} placeholder="Optional." value={form?.reason ?? ""} />
    </div>
    <br />
    {#if advisor}
        <label>
            <input type="checkbox" name="delegated" class="bg-4" checked={form?.delegated} />
            Set advisor as voter
        </label>
        <br />
    {/if}
    <input type="submit" value="Create Guild" />
</form>

<style lang="scss">
    #content {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px 25px;
    }
</style>
