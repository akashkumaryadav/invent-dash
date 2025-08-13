import { useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import CategoryChart from './components/CategoryChart';
import { useAppDispatch } from './hooks';
import { loadItems } from './slices/itemsSlice';
import { initSocket } from './socket';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadItems());
    initSocket(dispatch);
  }, [dispatch]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1>Real-Time Inventory Dashboard</h1>
      <SearchBar />
      <AddItemForm />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 16 }}>
        <InventoryTable />
        <CategoryChart />
      </div>
    </div>
  );
}

export default App;
