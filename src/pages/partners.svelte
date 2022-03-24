<script>
  import Fuse from 'fuse.js';
  import Partner from '../components/partner.svelte';

  let query = '';
  let partners = [
    {
      "id": "1",
      "invite": "invto1",
      name: 'Jean Mains',
      character: 'Jean',
      "owner": "1",
      "advisor": "2"
    },
    {
      "id": "2",
      "invite": "invto2",
      name: 'Sayu Mains',
      character: 'Sayu',
      "owner": "2",
      "advisor": null
    },
    {
      "id": "3",
      "invite": "invto3",
      name: 'Venti Mains',
      character: 'Venti',
      "owner": null,
      "advisor": null
    },
    {
      "id": "4",
      "invite": "invto4",
      name: 'Kazuha Mains',
      character: 'Kazuha',
      "owner": null,
      "advisor": null
    }
  ];
  $: fuse = new Fuse(partners, { keys: ['name', 'character'] });
  $: filtered = query ? fuse.search(query).map(res => res.item) : partners;
</script>


<h1>Our Partners</h1>
<h4>This currently uses test data,<br> until the TCN API is live.</h4>

<input type="text" bind:value={query} placeholder="Search..">

<div class="list">
  {#each filtered as partner }
    <Partner {partner}/>
  {/each}
</div>


<style>
  h1 {
    padding-left: 8px;
  }

  input {
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