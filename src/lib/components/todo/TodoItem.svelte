<script lang="ts">
	import type { TODO } from '$lib/db';
	import { todo } from '$lib/TodoControler.svelte';
	import { modal } from '$lib/ModalControler.svelte';

	let { data }: { data: TODO } = $props();

	function transforDate(date: number | string) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(date));
	}
</script>

{#snippet detailsModal()}
	<h3 class="text-xl text-center pb-4 mb-4 border-b">Todo Item Details</h3>
	<div class="grid mb-4 pb-10 border-b gap-5 grid-cols-1 md:grid-cols-2">
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Todo Item Description</span>
			</div>
			<input
				class="input input-bordered w-full max-w-xs"
				placeholder="Enter todo item"
				type="text"
				bind:value={data.name}
			/>
		</label>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Todo Item Deadline</span>
			</div>
			<span class="text-base text-gray-500"
				>{transforDate(data?.deadline ?? new Date().getTime())}</span
			>
			<input type="hidden" />
		</label>
	</div>
	<div class="flex gap-5 justify-center items-center">
		<button
			onclick={() => {
				todo.update(data);
				modal.close();
			}}
			class="btn btn-primary">Update</button
		>
		<button
			onclick={() => {
				todo.remove(data.id!);
				modal.close();
			}}
			class="btn btn-error">Delete</button
		>
	</div>
{/snippet}

<label class="label cursor-pointer">
	<input
		type="checkbox"
		bind:checked={data.done}
		onchange={() => todo.toggleDone()}
		class="checkbox checkbox-primary"
	/>
	<h3 class={data.done ? 'line-through' : ''}>{data.name}</h3>

	<div class="flex justify-center items-center gap-3">
		<button onclick={() => modal.open({ content: detailsModal })} class="btn btn-info"
			>Details</button
		>
	</div>
</label>
