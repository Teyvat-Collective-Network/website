<script>
  const icons = {
    dark: 'moon',
    light: 'sun'
  }
  let theme = window.localStorage.getItem('theme') || 'light';
  $: document.getElementById('themelink').href = `styles/${theme}.css`;
  $: window.localStorage.setItem('theme', theme);
</script>


<div>
  <p>
    &copy; 2022
    <a href="https://github.com/msbukkuri">Swiftfyre</a>,
    <a href="https://github.com/AroLeaf">AroLeaf</a>
  </p>
  <label>
    <span class="fa-solid fa-{icons[theme]}"></span>
    <input type="checkbox" checked={window.localStorage.getItem('theme') === 'dark'} on:input={(e) => theme = e.target.checked ? 'dark' : 'light'}>
  </label>
</div>


<style>
  div {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  label {
    cursor: pointer;
    font-size: 20px;
  }

  input {
    display: none;
  }
</style>