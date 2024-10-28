<script lang="ts">
	import { onMount } from 'svelte';
	import { todo } from '$lib/TodoControler.svelte';
	import { modal } from '$lib/ModalControler.svelte';
	import type { TODO } from '$lib/db';
	import TodoItem from './TodoItem.svelte';
	import { crossfade } from 'svelte/transition';

	let newTodoName = $state<string>('');
	let todoItem: TODO = $state({ name: '', done: false, deadline: 0, labels: [] });

	const [send, receive] = crossfade({});

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			todo.add(newTodoName);
			newTodoName = '';
		}
	}

	function handleAddTodo() {
		todo.add(todoItem);

		todoItem = { name: '', done: false, deadline: 0, labels: [] };
		modal.close();
	}
</script>

{#snippet createModal()}
	<h3 class="text-xl text-center pb-4 mb-4 border-b">Add new todo item</h3>
	<div class="grid gap-5 grid-cols-1 md:grid-cols-2">
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text text-ellipsis overflow-hidden whitespace-nowrap">Todo Item Description</span>
			</div>
			<input
				class="input input-bordered w-full max-w-xs"
				placeholder="Enter todo item"
				type="text"
				onkeydown={handleInputKeydown}
				bind:value={todoItem.name}
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Todo Item Deadline</span>
			</div>
			<input
				class="input input-bordered w-full max-w-xs"
				type="date"
				placeholder="select deadline date"
				bind:value={todoItem.deadline}
			/>
		</label>

		<button onclick={handleAddTodo} class="btn btn-primary md:col-span-2 text-base font-semibold"
			>Add</button
		>
	</div>
{/snippet}

<section class="flex flex-col">
	<div class="flex flex-col-reverse md:flex-row w-full justify-center items-center mt-10 gap-4">
		<input
			class="input input-bordered w-full max-w-xs"
			placeholder="Enter todo item"
			type="text"
			onkeydown={handleInputKeydown}
			bind:value={newTodoName}
		/>
		<button class="btn btn-ghost" onclick={() => modal.open({ content: createModal })}>Show extended params</button>
	</div>
	<div class="flex flex-col md:flex-row justify-center gap-4 p-4">
		{#if todo.items.length && !todo.isLoading}
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">TODO</h2>
				<ul class="w-full">
					{#each todo.unDoneItems as undone (undone.id)}
						<li
							class="form-control w-full"
							in:receive={{ key: undone.id }}
							out:send={{ key: undone.id }}
						>
							<TodoItem data={undone} />
						</li>
					{/each}
				</ul>
			</div>
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">Done</h2>
				<ul class="list">
					{#each todo.doneItems as done (done.id)}
						<li
							class="form-control w-full"
							in:receive={{ key: done.id }}
							out:send={{ key: done.id }}
						>
							<TodoItem data={done} />
						</li>
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
