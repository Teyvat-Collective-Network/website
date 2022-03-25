<script>
  const icons = {
    dark: 'moon',
    light: 'sun',
    hover: {
      dark: 'sun',
      light: 'moon',
    }
  }
  let theme = window.localStorage.getItem('theme') || 'light';
  $: document.getElementById('themelink').href = `styles/${theme}.css`;
  $: window.localStorage.setItem('theme', theme);
</script>


<footer>
  <p>
    &copy; 2022
    <a href="https://github.com/msbukkuri">Swiftfyre</a>,
    <a href="https://github.com/AroLeaf">AroLeaf</a>
  </p>
  <label>
    <span class="fa-stack">
      <span class="fa-solid fa-stack-2x fa-{icons[theme]}"></span>
      <span class="fa-solid fa-stack-2x fa-{icons.hover[theme]} hover"></span>
    </span>
    <input type="checkbox" checked={window.localStorage.getItem('theme') === 'dark'} on:input={(e) => theme = e.target.checked ? 'dark' : 'light'}>
  </label>
</footer>


<style>
  footer {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 16px;
  }

  label {
    cursor: pointer;
    font-size: 16px;
  }

  .fa-solid { transition: .2s; }
  .fa-solid.hover{ opacity: 0; }
  label:hover .fa-solid { opacity: 0; }
  label:hover .fa-solid.hover { opacity: 1; }

  input {
    display: none;
  }
</style>