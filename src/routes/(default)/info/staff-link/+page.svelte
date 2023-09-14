<script lang="ts">
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import Navigation from "$lib/components/Navigation.svelte";
</script>

<div class="container">
    <Navigation last={["/info/quickstart#staff-link", "Quickstart"]}>
        <h1>Staff Link</h1>
        <p>
            To manage your staff via the TCN API, you will need to use the TCN bot. You can access it in HQ and in the TCN Hub, but adding it to your server
            with
            <A to="https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot" external
                >this link</A
            > makes things easier and allows you to use automatic role sync.
        </p>
        <ul>
            <li>To add a staff member manually, use <code>/staff add</code> (and to remove them, use <code>/staff remove</code>).</li>
            <li>
                To list a server's staff, use <code>/staff members</code>. Conversely, use <code>/staff list</code> to list the servers in which a user staffs.
            </li>
            <li>
                To modify a user's TCN roles, use <code>/staff roles</code>. You can actually run this command on non-staff, but it typically won't be
                meaningful.
            </li>
            <li>
                To automatically sync staff, use <code>/autostaff add</code> to add a role, <code>/autostaff remove</code> to remove a role, and
                <code>/autostaff list</code> to list registered staff roles. Users with any of these roles will automatically be considered staff.
            </li>
        </ul>
        <p>Staff will automatically gain the <Mention>Network Staff</Mention> role and your server's color role in the TCN Hub.</p>
        <p>Permission to submit banshares from your server is controlled by the <code>banshares</code> TCN role and may only be done by registered staff.</p>
    </Navigation>
</div>
