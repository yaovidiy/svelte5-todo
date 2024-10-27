<script>
	import '../app.css';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Toasts from '$lib/components/ui/Toasts.svelte';

	let { children } = $props();

	let isDarkMode = $state(true);

	$effect(() => {
		if (isDarkMode) {
			document.documentElement.dataset.theme = 'night';
			return;
		}

		document.documentElement.dataset.theme = 'emerald';
	});
</script>

<div class="flex justify-end">
	<input type="checkbox" class="toggle mt-4 mr-4" bind:checked={isDarkMode} />
</div>
{@render children()}
<Modal />
<Toasts />
