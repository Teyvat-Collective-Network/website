<script lang="ts">
    import A from "$lib/components/A.svelte";
</script>

<div class="container">
    <h1>Glossary</h1>
    <table>
        <tr>
            <th>Term</th>
            <th>Meaning</th>
        </tr>
        <tr>
            <td><b><A to="/info/banshares" external>Banshare</A></b></td>
            <td>
                A collection of evidence filed against one or more users with the intent of allowing other servers to become aware of a potential problem /
                threat.
            </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#definitions">Council Advisor</A></b></td>
            <td>
                The secondary representative of a TCN server. Servers are not required to have one. They can contribute to discussions as well and perform tasks
                on behalf of the server owner (including voting) if the responsibility is <A to="/info/constitution#delegation">delegated</A> to them.
            </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#induction">Induction</A></b></td>
            <td>
                The process of adding a new server to the network, usually referring to the actual act of adding the server and inviting its representative(s).
            </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#general-protocols">Major Vote</A></b></td>
            <td> A vote with 75% quorum. </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#general-protocols">Minor Vote</A></b></td>
            <td> A vote with 60% quorum. </td>
        </tr>
        <tr>
            <td><b><A to="/observation-faq">Observation</A></b></td>
            <td>
                The process of overseeing a server's actions. This is carried out by an observer who publishes a report for voting at the end of observation.
            </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#observer-committee">Observer</A></b></td>
            <td>
                The admins of the Teyvat Collective Network. They represent the network publicly, handle internal administrative tasks, observe applicants for
                induction, and regulate the HQ environment if needed.
            </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#general-protocols">Quorum</A></b></td>
            <td> The voter turnout requirement. For <b>minor votes</b> (most votes), it is 60%. For <b>major votes</b>, it is 75%. </td>
        </tr>
        <tr>
            <td><b><A to="/info/constitution#definitions">Server Owner</A></b></td>
            <td>
                The owner of a TCN server. By default, the designated voter is the server owner but this can be
                <A to="/info/constitution#delegation">delegated</A> to the council advisor.
            </td>
        </tr>
    </table>
</div>

<style lang="scss">
    table {
        width: 100%;
    }

    table,
    tr,
    th,
    td {
        border: 1px solid rgb(var(--invert-rgb), 25%);
        border-collapse: collapse;
    }

    th,
    td {
        padding: 0.5em 1em;
    }
</style>
