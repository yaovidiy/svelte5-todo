<script lang="ts">
	let { date, isToday }: { date: number; isToday: boolean } = $props();
</script>

<div
	class="relative w-full cursor-pointer {isToday
		? 'bg-primary text-primary-content'
		: ''} h-full min-h-20 hover:bg-neutral hover:text-neutral-content border-[1px]"
>
	<span class="absolute top-1 right-2 text-sm">{date}</span>
</div>
