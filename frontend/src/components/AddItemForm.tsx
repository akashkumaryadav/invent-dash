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
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: 100 }}
      />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
