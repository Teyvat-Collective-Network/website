<script>
  import Brand from './brand.svelte';
  import Link from './headerLink.svelte';
</script>


<header>
  <Brand/>
  <div class="links">
    <Link name="Home"/>
    <Link name="Partners"/>
    <a class="button" href="https://docs.google.com/forms/d/e/1FAIpQLSfHvphb8BDnKK2wp-D7qtEcmjWlypZZBIU6T8qGnnqwxyXgOQ/viewform">Apply Now</a>
  </div>
</header>


<style>
  header {
    display: grid;
    grid-template-columns: auto auto;
    padding: 16px 0px;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-left: auto;
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

  @media screen and (max-width: 540px) {
    header {
      grid-template-columns: 1fr;
    }

    .links {
      gap: 32px 64px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>