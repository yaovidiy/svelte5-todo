<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Toast } from '$lib';
	const { toasts }: { toasts: Toast[] } = $props();

	function setClassess(type: string) {
		return `alert alert-${type}`;
	}
</script>

{#snippet tost(toast: Toast)}
	<div
		role="alert"
		out:fade
		class="alert"
		class:alert-info={toast.type === 'info'}
		class:alert-success={toast.type === 'success'}
		class:alert-error={toast.type === 'danger'}
	>
		<span>{toast.content}</span>
	</div>
{/snippet}

<div class="toast toast-end">
	{#each toasts as toast}
		{@render tost(toast)}
	{/each}
</div>
