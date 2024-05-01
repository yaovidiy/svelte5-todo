<script lang="ts">
	import db, { type TODO } from '$lib/db';

	let todos = $state<TODO[]>([]);
	let newTodoName = $state<string>('');
	let saving = $state<boolean>(false);
	let done = $derived<TODO[]>(todos.filter((todo) => todo.done));
	let notDone = $derived<TODO[]>(todos.filter((todo) => !todo.done));
	let canSave = $derived<boolean>(todos.length > 0);
	let canLoad = $derived<boolean>(todos.length === 0);

	async function loadFromDB() {
		if (!canLoad) {
			return;
		}
		const dbTodos = await db.todos.toArray();

		todos = dbTodos;
	}

	async function saveToDB(e: Event) {
		e.preventDefault();
		if (!canSave) {
			return;
		}

		saving = true;
		const savePromises: Promise<any>[] = [];
		todos.forEach((todo) => {
			savePromises.push(db.todos.add({ ...todo }));
		});

		await Promise.allSettled(savePromises);

		saving = false;

		alert('Saved locally');
	}

	function addTodo(e: Event) {
		e.preventDefault();
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

		document.documentElement.dataset.theme = 'nordemerald';
	});
</script>

{#snippet listOption(data: TODO)}
	<li class="form-control">
		<label class="label cursor-pointer">
			<input type="checkbox" bind:checked={data.done} class="checkbox checkbox-primary" />
			<span class="label-text">{data.name}</span>
		</label>
	</li>
{/snippet}

<input type="checkbox" class="toggle" bind:checked={isDarkMode} />

<section class="flex flex-col">
	<div class="col col-12">
		<input class="input input-bordered w-full max-w-xs" placeholder="Enter todo item" type="text" bind:value={newTodoName} />
		<button class="btn btn-secondary" onclick={saveToDB} disabled={!canSave && !saving}
			>{saving ? 'Saving...' : 'Save to DB'}</button
		>
	</div>
	{#if todos.length}
		<div class="col col-12 col-md-6">
			<h1>TODO</h1>
			<ul class="list">
				{#each notDone as todo}
					{@render listOption(todo)}
				{/each}
			</ul>
		</div>
		<div class="col col-12 col-md-6">
			<h1>Done</h1>
			<ul class="list">
				{#each done as todo}
					{@render listOption(todo)}
				{/each}
			</ul>
		</div>
		
	{/if}
</section>
