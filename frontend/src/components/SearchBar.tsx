import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loadItems, setQuery } from '../slices/itemsSlice';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.items.query);
  const [local, setLocal] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setQuery(local));
      dispatch(loadItems(local));
    }, 300);
    return () => clearTimeout(t);
  }, [local, dispatch]);

  return (
    <input
      placeholder="Search by name or category..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      style={{ width: '100%', padding: 8, marginBottom: 8 }}
    />
  );
}
