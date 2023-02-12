const none = 0;
const all = 1;
const settled = 2;
const unsettled = 3;

module.exports = {
  none,
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
