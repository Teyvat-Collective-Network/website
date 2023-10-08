<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "./Icon.svelte";

    export let on: boolean;
    export let fill: boolean = false;
    export let disabled: boolean = false;

    const dispatch = createEventDispatcher();
    $: on, dispatch("toggle", on);
</script>

<button class="row gap-1 {fill ? (on ? 'green-button' : 'red-button') : on ? 'tp green-text' : 'tp red-text'}" on:click={() => (on = !on)} {disabled}>
    <Icon icon={on ? "toggle_on" : "toggle_off"} />
    <slot />
</button>
