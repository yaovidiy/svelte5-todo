<script lang="ts">
	import { onMount } from 'svelte';
	import { todo } from '$lib/TodoControler.svelte';
	import { modal } from '$lib/ModalControler.svelte';
	import type { TODO } from '$lib/db';

	let newTodoName = $state<string>('');

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			todo.add(newTodoName);
			newTodoName = '';
		}
	}

	onMount(async () => {
		todo.loadFromDB();
	});
</script>

{#snippet listOption(data: TODO)}
	<li class="form-control w-full">
		<label class="label cursor-pointer">
			<input
				type="checkbox"
				bind:checked={data.done}
				onchange={() => todo.toggleDone()}
				class="checkbox checkbox-primary"
			/>
			<h3>{data.name}</h3>

			<button
				aria-label="Remove item"
				class="btn btn-square btn-primary"
				onclick={() => todo.remove(data.id)}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					class="fill-red-400"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M5 7.5H19L18 21H6L5 7.5Z" stroke="#000000" stroke-linejoin="round" />
					<path
						d="M15.5 9.5L15 19"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path d="M12 9.5V19" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8.5 9.5L9 19" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
					<path
						d="M16 5H19C20.1046 5 21 5.89543 21 7V7.5H3V7C3 5.89543 3.89543 5 5 5H8M16 5L15 3H9L8 5M16 5H8"
						stroke="#000000"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</label>
	</li>
{/snippet}

{#snippet modalContent()}
	<h3 class="text-lg font-bold">Hi there!</h3>
	<p class="py-4">You opened the modal!</p>
{/snippet}

<section class="flex flex-col">
	<div class="flex w-full justify-center items-center mt-10 gap-4">
		<input
			class="input input-bordered w-full max-w-xs"
			placeholder="Enter todo item"
			type="text"
			onkeydown={handleInputKeydown}
			bind:value={newTodoName}
		/>
	</div>
	<div class="flex justify-center gap-4 p-4">
		{#if todo.items.length && !todo.isLoading}
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">TODO</h2>
				<ul class="w-full">
					{#each todo.unDoneItems as undone}
						{@render listOption(undone)}
					{/each}
				</ul>
			</div>
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">Done</h2>
				<ul class="list">
					{#each todo.doneItems as done}
						{@render listOption(done)}
					{/each}
				</ul>
			</div>
		{:else if todo.isLoading}
			<div class="loading loading-dots loading-lg m-auto"></div>
		{:else}
			<h2 class="text-center">No Todo Items added!</h2>
		{/if}
	</div>

</section>
