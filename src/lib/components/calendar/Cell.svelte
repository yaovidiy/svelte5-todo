<script lang="ts">
	import type { TODO } from '$lib/db';
	import { modal } from '$lib/ModalControler.svelte';
	import { todo } from '$lib/TodoControler.svelte';
	import { onMount } from 'svelte';

	let { date, isToday, cellDate }: { date: number; isToday: boolean; cellDate: Date } = $props();

	let cellData = $state<TODO[]>([]);

	onMount(async () => {
		cellData = await todo.getByDate(cellDate);
	});
</script>

<div
	role="button"
	tabindex="0"
	onkeydown={() => {}}
	onclick={() => {
		modal.open({
			content: cellDetail,
			header: cellHeader
		});
	}}
	class="relative w-full cursor-pointer {isToday
		? 'bg-primary text-primary-content'
		: ''} h-full min-h-20 hover:bg-neutral hover:text-neutral-content border-[1px]"
>
	<span class="absolute top-1 right-2 text-sm">{date}</span>
</div>

{#snippet cellHeader()}
	<h2 class="text-2xl text-center pb-3 mb-5 border-b">
		{new Intl.DateTimeFormat('en-US', {
			dateStyle: 'full'
		}).format(cellDate)}
	</h2>
{/snippet}

{#snippet cellDetail()}
	<div class="flex flex-col gap-4">
		{#each cellData as entry (entry.id)}
			<div class="flex flex-col gap-3 border-b mb-3">
				<div class="flex justify-between">
					<h3 class="text-lg font-bold">{entry.name}</h3>
				</div>
				<div class="flex">
					<p class="text-xs">
						Deadline:
						{new Intl.DateTimeFormat('en-US', {
							dateStyle: 'short'
						}).format(new Date(entry.deadline ?? ''))}
					</p>
				</div>
				<p class="text-base">Description:</p>
				<p class="text-sm">{entry.description ?? 'lorem ipsum dolor'}</p>
			</div>
		{/each}
	</div>
{/snippet}
