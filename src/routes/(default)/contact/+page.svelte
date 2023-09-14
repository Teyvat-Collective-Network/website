<script lang="ts">
    import api from "$lib/api";
    import Invite from "$lib/components/Invite.svelte";
    import Link from "$lib/components/Link.svelte";
    import Linkable from "$lib/components/Linkable.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { token } from "$lib/stores";
    import type { User } from "$lib/types";
    import { onMount } from "svelte";

    let observers: User[] = null!;

    onMount(async () => {
        const users = (await api($token, `GET /users`)).filter((user: User) => user.observer);
        for (const user of users) user.tag = await api($token, `GET /tag/${user.id}`);
        observers = users;
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
                <li><Link to="/user/{user.id}">{user.tag}</Link> &mdash; <code>{user.id}</code></li>
            {/each}
        </ul>
    </Loading>
</div>
