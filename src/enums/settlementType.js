const all = 0;
const settled = 1;
const unsettled = 2;

module.exports = {
  all,
  settled,
  unsettled,
  items: [
    { id: all, text: 'Wszystkie' },
    { id: settled, text: 'Rozliczone' },
    { id: unsettled, text: 'Nierozliczone' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
};
