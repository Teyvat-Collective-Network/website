<script>
  import images from '../../public/images.js';
  export let partner;
</script>


<div class="partner">
  <img src={images[partner.character]} alt={partner.character} height="128px" width="128px">
  <h3>{partner.name}</h3>
  <a class="button" href="https://discord.gg/{partner.invite}" target="_blank">Join</a>
</div>


<style>
  .partner {
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 16px;
    background-color: var(--col-light);
    text-align: center;
    place-items: center;
    gap: 16px;
  }

  .partner img {
    display: inline-block;
    margin: 16px;
  }

  .button {
    padding: 12px 24px;
    border-radius: 4px;
    background-color: var(--col-dark);
    color: #fff;
    transition: .15s;
  }
  .button:hover {
    background-color: var(--col-mid);
  }
</style>