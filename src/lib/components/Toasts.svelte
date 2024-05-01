<script lang="ts">
  import { fade } from 'svelte/transition';
	import type { Toast } from '$lib';
	const { toasts }: { toasts: Toast[] } = $props();
</script>

{#snippet tost(toast: Toast)}
	<div out:fade class={`alert alert-${toast.type}`}>
		<span>{toast.content}</span>
	</div>
{/snippet}

<div class="toast toast-end">
	{#each toasts as toast}
		{@render tost(toast)}
	{/each}
</div>
