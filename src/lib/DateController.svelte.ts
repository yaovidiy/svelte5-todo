export class DateController {
  current: Date = $state(new Date());
  currentDay: number = $derived(this.current.getDate());
  currentMonth: number = $derived(this.current.getMonth());
  currentYear: number = $derived(this.current.getFullYear());
  selectedMonth: number = $state(this.currentMonth);
  selectedYear: number = $state(this.currentYear);
  selectedDay: number = $state(this.currentDay);
  daysOfWeek: string[] = $state(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  daysInMonth: number[] = $derived.by(() => {
    const date = new Date(this.selectedYear, this.selectedMonth, 1);
    const days = [];

    while (date.getMonth() === this.selectedMonth) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }

    return days;
  });
  selectedMonthFistDay: number = $derived(new Date(this.selectedYear, this.selectedMonth, 1).getDay());

  selectDay(day: number) {
    this.selectedDay = day;
  }

  selectMonth(month: number) {
    this.selectedMonth = month;
  }

  selectYear(year: number) {
    this.selectedYear = year;
  }

  getCellDate(day: number) {
    return new Date(this.selectedYear, this.selectedMonth, day);
  }

  getSelectedDate() {
    return new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
  }

  getMonthName(month: number) {
    return new Date(this.selectedYear, month, 1).toLocaleString('default', { month: 'long' });
  }
}