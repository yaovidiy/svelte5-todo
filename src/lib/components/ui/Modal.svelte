<script lang="ts">
	import { modal } from '$lib/ModalControler.svelte';

	let dialogElement: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (modal.isModalOpen) {
			dialogElement?.showModal();
		} else {
			dialogElement?.close();
		}
	});
</script>

<dialog onclose={() => (modal.isModalOpen = false)} bind:this={dialogElement} class="modal">
	<div class="modal-box">
		{#if modal.modalHeader}
			{@render modal.modalHeader()}
		{/if}
		{#if modal.modalContent}
			{@render modal.modalContent()}
		{:else}
			<p>Modal content is not provided</p>
		{/if}
		{#if modal.modalFooter}
			{@render modal.modalFooter()}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
