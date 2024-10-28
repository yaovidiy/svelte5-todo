<script lang="ts">
	import Cell from './Cell.svelte';
	import { DateController } from '$lib/DateController.svelte';

	const date = new DateController();
	// let speechOutput = $state('');
	// let recognition: typeof window.SpeechRecognition | undefined;

	// onMount(() => {
	// 	recognition = new (window?.SpeechRecognition ||
	// 		window?.webkitSpeechRecognition ||
	// 		window?.mozSpeechRecognition ||
	// 		window?.msSpeechRecognition)();

	// 	recognition.lang = 'uk-UA';

	// 	recognition.onresult = (event) => {
	// 		const transcript = event.results[0][0].transcript;
	// 		speechOutput = transcript;
	// 	};
	// });
</script>

<!-- <button
	onclick={() => {
		recognition?.start();
	}}>Start</button
>

{speechOutput}

<button
	onclick={() => {
		recognition?.stop();
	}}>Stop</button
> -->

<div class="flex gap-10">
	<select
		class="select"
		onchange={(e) => {
			date.selectMonth(parseInt((e.target as HTMLSelectElement)?.value ?? 0));
		}}
	>
		{#each Array.from({ length: 12 }, (_, i) => i) as month}
			<option value={month} selected={month === date.selectedMonth}
				>{date.getMonthName(month)}</option
			>
		{/each}
	</select>
	<select
		onchange={(e) => {
			date.selectYear(parseInt((e.target as HTMLSelectElement)?.value ?? 0));
		}}
		class="select"
		name="year"
	>
		{#each Array.from({ length: 10 }, (_, i) => i) as year}
			<option value={2023 + year} selected={2023 + year === date.selectedYear}>{2023 + year}</option
			>
		{/each}
	</select>
</div>

<section class="grid grid-cols-7">
	{#each date.daysOfWeek as day}
		<div class="p-2 text-center font-bold">{day}</div>
	{/each}
	{#each date.daysInMonth as day}
		{#if date.selectedMonthFistDay > 0 && day === 1}
			{#each Array.from({ length: date.selectedMonthFistDay }, (_, i) => i) as _}
				<div class="p-2 text-center"></div>
			{/each}
		{/if}
		<Cell
			date={day}
			cellDate={date.getCellDate(day)}
			isToday={date.currentDay === day &&
				date.currentMonth === date.selectedMonth &&
				date.currentYear === date.selectedYear}
		/>
	{/each}
</section>
