<script lang="ts">
	import { modal } from '$lib/ModalControler.svelte';

	let dialogElement: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (modal.isOpen) {
			dialogElement?.showModal();
		} else {
			dialogElement?.close();
		}
	});
</script>

<dialog onclose={() => (modal.isOpen = false)} bind:this={dialogElement} class="modal">
	<div class="modal-box">
		{#if modal.header}
			{@render modal.header()}
		{/if}
		{#if modal.content}
			{@render modal.content()}
		{:else}
			<p>Modal content is not provided</p>
		{/if}
		{#if modal.footer}
			{@render modal.footer()}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
