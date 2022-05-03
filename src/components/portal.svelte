<script>
  import { page } from '../stores.js';
</script>


<div class="portal">
  
  <div class="card">
    <h4>The TCN is a network of over 35 Discord servers, each dedicated to a playable character from the game &ldquo;Genshin Impact&rdquo;.</h4>
    <a class="button" on:click={() => $page = 'partners'} href="#partners">Our Partners</a>
  </div>
  <div class="card">
    <h4>Do you own a Discord server dedicated to a playable Genshin Impact character, and want to join the TCN? Apply here:</h4>
    <a class="button" href="https://forms.teyvatcollective.network/#/form/626fd5c781d924afabadeb05" target="_blank">Apply to Join</a>
  </div>
</div>

<style>
  .portal {
    padding: 32px 0px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  h4 {
    padding: 16px;
  }

  .card {
    display: grid;
    grid-template-rows: 1fr auto;
    background-color: var(--col-light);
    padding: 16px;
    place-items: start center;
    gap: 16px;
  }

  .button {
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 24px;
    background-color: var(--col-dark);
    color: #fff;
  }
  .button:hover {
    background-color: var(--col-mid);
  }


  @media screen and (max-width: 540px) {
    .portal {
      grid-template-columns: 1fr;
    }
  }
</style>