const ascending = 0;
const descending = 1;

module.exports = {
  ascending,
  descending,
  items: [
    { id: ascending, text: 'Rosnąco', sqlKeyword: 'asc' },
    { id: descending, text: 'Malejąco', sqlKeyword: 'desc' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === parseInt(id, 10));
    return item ? item.text : '';
  },
  getSqlKeyword(id) {
    const item = this.items.find((u) => u.id === parseInt(id, 10));
    return item ? item.sqlKeyword : 'asc';
  },
};
