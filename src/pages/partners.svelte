<script>
  import Fuse from 'fuse.js';
  import Partner from '../components/partner.svelte';

  let query = '';
  export let partners = [];

  $: fuse = new Fuse(partners, {
    keys: ['name', 'character'],
    threshold: 0.25,
  });
  $: filtered = query ? fuse.search(query).map(res => res.item) : partners;
</script>


<h1>Our Partners</h1>

<input type="text" bind:value={query} placeholder="Search..">

<div class="list">
  {#if filtered.length}
    {#each filtered as partner }
      <Partner {partner}/>
    {/each}
  {:else if partners.length}
    <h3>No Results</h3>
  {:else}
    <h3>Loading..</h3>
  {/if}
  
</div>


<style>
  h1 {
    padding-left: 8px;
  }

  input {
    background-color: var(--bg-main);
    position: absolute;
    right: 0px;
    margin-top: -32px;
    font-size: 20px;
    padding: 4px;
    border: 3px solid var(--col-light);
    outline: none;
    border-radius: 4px;
    color: var(--txt-main);
    font-weight: 500;
  }

  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 64px;
    padding: 32px 0px;
  }


  @media screen and (max-width: 540px) {
    input {
      max-width: 100%;
      position: unset;
      margin-top: 16px;
    }

    .list {
      grid-template-columns: 1fr;
    }
  }
</style>