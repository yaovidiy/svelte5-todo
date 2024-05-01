<script lang="ts">
	import db, { type TODO } from '$lib/db';
	import { onMount } from 'svelte';
	import type { Toast } from '$lib';
	import Toasts from '$lib/components/Toasts.svelte';

	let loading = $state(false);
	let todos = $state<TODO[]>([]);
	let newTodoName = $state<string>('');
	let saving = $state<boolean>(false);
	let toasts = $state<Toast[]>([]);
	let savedInDbTodos = $state<TODO[]>([]);
	let done = $derived<TODO[]>(todos.filter((todo) => todo.done));
	let notDone = $derived<TODO[]>(todos.filter((todo) => !todo.done));
	let canSave = $derived<boolean>(todos.length > 0);
	let canLoad = $derived<boolean>(todos.length === 0);
	let interval: ReturnType<typeof setInterval> = 0;

	async function loadFromDB() {
		if (!canLoad) {
			return;
		}
		const dbTodos = await db.todos.toArray();

		if (dbTodos.length) {
			showToast({ type: 'success', content: 'We haved loaded previosly saved Todo list for you' });
		} else {
			showToast({ type: 'danger', content: 'There was no saved Todo list in this browser' });
		}
		todos = dbTodos;
		savedInDbTodos = dbTodos;
	}

	async function saveToDB() {
		if (!canSave) {
			return;
		}

		saving = true;
		const getDBData = await db.todos.toArray();

		const savePromises: Promise<any>[] = [];
		todos.forEach((todo) => {
			if (!getDBData.length) {
				savePromises.push(db.todos.add({ ...todo }));
				return;
			}

			const todoInTheList = getDBData.find((dbTodo) => dbTodo.id === todo.id);

			if (!todoInTheList) {
				savePromises.push(db.todos.add({ ...todo }));
				return;
			}

			savePromises.push(db.todos.update(todo.id, todo));
		});

		await Promise.allSettled(savePromises);

		await loadFromDB();
		saving = false;
		showToast({ type: 'success', content: 'Saved current Todo list to the DB' });
	}

	onMount(async () => {
		loading = true;
		await loadFromDB();
		loading = false;
	});

	function showToast(data: Toast) {
		toasts.push(data);

		setTimeout(() => {
			if (toasts.length) {
				toasts.pop();
			}
		}, 2000);
	}

	async function deleteTodo(todoId: number) {
		todos = todos.filter(({ id }) => id !== todoId);
		await db.todos.delete(todoId);
		await loadFromDB();

		showToast({ type: 'success', content: 'You have deleted todo item!' });
	}

	function addTodo() {
		if (newTodoName.trim() === '') {
			return;
		}
		const todo: TODO = {
			id: Math.random(),
			done: false,
			name: newTodoName
		};

		todos = [...todos, todo];

		newTodoName = '';
	}

	let isDarkMode = $state(true);

	$effect(() => {
		if (isDarkMode) {
			document.documentElement.dataset.theme = 'night';
			return;
		}

		document.documentElement.dataset.theme = 'emerald';
	});

	$effect(() => {
		if (todos.length !== savedInDbTodos.length) {
			saveOnChanged()
		}
	});

	function saveOnChanged() {
		if (interval) {
				clearTimeout(interval);
			}

			interval = setTimeout(() => {
				saveToDB();
			}, 2000);
	}

	function handleInputKeydown(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			addTodo();
		}
	}
</script>

{#snippet listOption(data: TODO)}
	<li class="form-control w-full">
		<label class="label cursor-pointer">
			<input type="checkbox" bind:checked={data.done} onchange={saveOnChanged} class="checkbox checkbox-primary" />
			<h3>{data.name}</h3>

			<button class="btn btn-square btn-primary" onclick={() => deleteTodo(data.id)}>
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

<div class="flex justify-end">
	<input type="checkbox" class="toggle mt-4 mr-4" bind:checked={isDarkMode} />
</div>

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
		{#if todos.length && !loading}
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">TODO</h2>
				<ul class="w-full">
					{#each notDone as todo}
						{@render listOption(todo)}
					{/each}
				</ul>
			</div>
			<div class="mt-10 w-full md:w-1/2">
				<h2 class="text-center">Done</h2>
				<ul class="list">
					{#each done as todo}
						{@render listOption(todo)}
					{/each}
				</ul>
			</div>
		{:else if loading}
			<div class="loading loading-dots loading-lg m-auto"></div>
		{:else}
			<h2 class="text-center">No Todo Items added!</h2>
		{/if}
	</div>

	<Toasts {toasts} />
</section>
