import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { createItem } from '../slices/itemsSlice';

export default function AddItemForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [category, setCategory] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    dispatch(createItem({ name, quantity, category }));
    setName('');
    setQuantity(0);
    setCategory('');
  };

  return (
    <form onSubmit={onSubmit} className="form-inline">
      <input
        className="input"
        placeholder="Name"
        aria-label="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input w-24"
        placeholder="Quantity"
        type="number"
        aria-label="Item quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <input
        className="input"
        placeholder="Category"
        aria-label="Item category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit" className="btn primary">Add</button>
    </form>
  );
}
