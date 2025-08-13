import { useAppDispatch, useAppSelector } from '../hooks';
import { patchItem, removeItem } from '../slices/itemsSlice';

export default function InventoryTable() {
  const { items, status } = useAppSelector((s) => s.items);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h2>Inventory</h2>
      {status === 'loading' && <p>Loading...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Quantity</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Category</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
              <td>
                <input
                  aria-label={`qty-${it.id}`}
                  type="number"
                  defaultValue={it.quantity}
                  onBlur={(e) =>
                    dispatch(
                      patchItem({ id: it.id, data: { quantity: Number(e.target.value) } })
                    )
                  }
                  style={{ width: 80 }}
                />
              </td>
              <td>{it.category}</td>
              <td>
                <button onClick={() => dispatch(removeItem(it.id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
