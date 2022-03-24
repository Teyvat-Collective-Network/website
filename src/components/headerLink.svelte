<script>
  import { page } from '../stores.js';

  export let name;
  let label = name.toLowerCase();
</script>


<a on:click={() => $page = label} class:active={$page === label} href="#{label}">{name}</a>


<style>
  a {
    padding: 16px 0px;
    font-size: 24px;
    justify-self: flex-end;
    border-color: transparent;
  }

  .active {
    padding: 12px 0px;
    color: var(--txt-contrast);
    border-top: 4px solid transparent;
    border-bottom: 4px solid var(--txt-contrast);
  }
</style>