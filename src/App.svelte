<script>
	import Header from './components/header.svelte';
	import Footer from './components/footer.svelte';

	import Home from './pages/home.svelte';
	import Partners from './pages/partners.svelte';

	import { page } from './stores.js';

	$: window.location.hash = $page;

	let partners = [];

	fetch('https://api.teyvatcollective.network/guilds')
    .then(res => res.json())
    .then(json => partners = Object.values(json).sort((a,b) => (a.character > b.character) ? 1 : ((b.character > a.character) ? -1 : 0)));

	const pages = {
		home: Home,
		partners: Partners,
	};
</script>


<Header/>

<main>
	<svelte:component this={pages[$page]} {partners}/>
</main>

<Footer/>


<style>
	main {
		position: relative;
	}
</style>