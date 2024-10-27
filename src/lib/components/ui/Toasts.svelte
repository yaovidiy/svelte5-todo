<script lang="ts">
	import { fade } from 'svelte/transition';
	import { toast } from '$lib/toastControler.svelte';
	import type { Toast } from '$lib';
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
	{#each toast.toasts as toastItem}
		{@render tost(toastItem)}
	{/each}
</div>
