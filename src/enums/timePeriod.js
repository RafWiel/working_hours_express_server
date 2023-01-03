const all = 0;
const currentWeek = 1;
const currentMonth = 2;
const previousMonth = 3;

module.exports = {
  all,
  currentWeek,
  currentMonth,
  previousMonth,
  items: [
    { id: all, text: 'Wszystkie' },
    { id: currentWeek, text: 'Bieżący tydzień' },
    { id: currentMonth, text: 'Bieżący miesiąc' },
    { id: previousMonth, text: 'Poprzedni miesiąc' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
};
