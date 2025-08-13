const express = require('express');
const store = require('../store/itemsStore');

const router = express.Router();

// GET /items?q=
router.get('/', (req, res) => {
  const q = req.query.q || '';
  const items = store.list({ q });
  res.json(items);
});

// POST /items
router.post('/', (req, res) => {
  const { name, quantity, category } = req.body || {};
  if (!name || !category) return res.status(400).json({ error: 'name and category required' });
  const item = store.create({ name, quantity, category });

  // broadcast
  req.app.locals.io.emit('item:created', item);

  res.status(201).json(item);
});

// PUT /items/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = store.update(id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Not found' });

  req.app.locals.io.emit('item:updated', updated);

  res.json(updated);
});

// DELETE /items/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const ok = store.remove(id);
  if (!ok) return res.status(404).json({ error: 'Not found' });

  req.app.locals.io.emit('item:deleted', { id });

  res.status(204).send();
});

module.exports = router;
