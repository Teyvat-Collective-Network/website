<script>
	import Header from './components/header.svelte';
	import Footer from './components/footer.svelte';

	import Home from './pages/home.svelte';
	import Partners from './pages/partners.svelte';

	import { page } from './stores.js';

	$: window.location.hash = $page;

	const pages = {
		home: Home,
		partners: Partners,
	};
</script>


<Header/>
<main>
	<svelte:component this={pages[$page]}/>
</main>
<Footer/>


<style>
	main {
		position: relative;
	}
</style>