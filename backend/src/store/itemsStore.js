// Simple in-memory store for items
// Item: { id: string, name: string, quantity: number, category: string }

let items = [];
let idSeq = 1;

function list({ q = '' } = {}) {
  const query = q.toLowerCase();
  if (!query) return items;
  return items.filter(
    (it) => it.name.toLowerCase().includes(query) || it.category.toLowerCase().includes(query)
  );
}

function create({ name, quantity, category }) {
  const item = { id: String(idSeq++), name, quantity: Number(quantity) || 0, category };
  items.push(item);
  return item;
}

function update(id, data) {
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, quantity: data.quantity !== undefined ? Number(data.quantity) : items[idx].quantity };
  return items[idx];
}

function remove(id) {
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

function clear() {
  items = [];
  idSeq = 1;
}

module.exports = { list, create, update, remove, clear };
