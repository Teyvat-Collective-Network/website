<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Invite from "$lib/components/Invite.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Mention from "$lib/components/Mention.svelte";
    import UserId from "$lib/components/UserId.svelte";
    import { token } from "$lib/stores";
    import type { User } from "$lib/types";
    import { onMount } from "svelte";

    let observers: User[];

    onMount(async () => {
        observers = (await api($token, `GET /users`)).filter((user: User) => user.observer);
    });
</script>

<div class="container">
    <h1>Contact Us</h1>
    <Linkable e="h2" id="hub">TCN Hub</Linkable>
    <p>Join the TCN Hub to contact observers and other server staff, ask questions, and give feedback on the TCN!</p>
    <Invite invite="FG2wpbywSx" />
    <Linkable e="h2" id="observers">Observers</Linkable>
    <Loading done={observers}>
        <ul>
            {#each observers as user}
                <li><A to="/user/{user.id}"><Mention><UserId id={user.id} /></Mention></A> &mdash; <code>{user.id}</code></li>
            {/each}
        </ul>
    </Loading>
</div>
