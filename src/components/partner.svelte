<script>
  import images from '../../public/images.js';
  export let partner;
</script>


<div class="partner">
  <img src={images[partner.character]} alt={partner.character} height="128px" width="128px">
  <h3>{partner.name}</h3>
</div>


<style>
  .partner {
    padding: 32px;
    background-color: var(--col-light);
    text-align: center;
  }

  .partner img {
    display: inline-block;
    margin: 16px;
  }
</style>