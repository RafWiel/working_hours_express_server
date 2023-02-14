const ascending = 0;
const descending = 1;

module.exports = {
  ascending,
  descending,
  items: [
    { id: ascending, sqlKeyword: 'asc' },
    { id: descending, sqlKeyword: 'desc' },
  ],
  getSqlKeyword(id) {
    const item = this.items.find((u) => u.id === parseInt(id, 10));
    return item ? item.sqlKeyword : 'asc';
  },
};
