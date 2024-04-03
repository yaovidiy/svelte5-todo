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
</script>

{#snippet listOptionDone(data: TODO)}
	<li class="list-option__done">
		<label>
			<input type="checkbox" bind:checked={data.done} />
			<span>{data.name}</span>
		</label>
	</li>
{/snippet}
{#snippet listOptionNotDone(data: TODO)}
	<li class="list-option__not-done">
		<label>
			<input type="checkbox" bind:checked={data.done} />
			<span>{data.name}</span>
		</label>
	</li>
{/snippet}

<section class="container">
	<div class="row">
		<div class="col col-12">
			<input class="input" type="text" bind:value={newTodoName} />
			<button class="btn btn-primary" onclick={addTodo}>Add todo</button>
			<button class="btn btn-secondary" onclick={saveToDB} disabled={!canSave && !saving}
				>{saving ? 'Saving...' : 'Saved to DB'}</button
			>
			<button class="btn btn-secondary" onclick={loadFromDB} disabled={!canLoad && !saving}
				>{saving ? 'Loading...' : 'Load from DB'}</button
			>
		</div>
		{#if todos.length}
			<div class="col col-12 col-md-6">
				<h1>TODO</h1>
				<ul class="list">
					{#each notDone as todo}
						{@render listOptionNotDone(todo)}
					{/each}
				</ul>
			</div>
			<div class="col col-12 col-md-6">
				<h1>Done</h1>
				<ul class="list">
					{#each done as todo}
						{@render listOptionDone(todo)}
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>

<style>
	.container {
		max-width: 1200px;
		margin-inline: auto;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.col {
		flex: 0 0 auto;
	}

	.col-12 {
		flex-basis: 100%;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 600px) {
		.col-md-6 {
			flex-basis: 50%;
		}
	}
</style>
