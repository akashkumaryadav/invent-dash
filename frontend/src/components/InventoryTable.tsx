import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { patchItem, removeItem } from '../slices/itemsSlice';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

export default function InventoryTable() {
  const { items, status } = useAppSelector((s) => s.items);
  const dispatch = useAppDispatch();

  type Row = {
    id: string;
    name: string;
    quantity: number;
    category: string;
  };

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <span>{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <span>{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: (info) => {
          const row = info.row.original as Row;
          return (
            <input
              aria-label={`qty-${row.id}`}
              type="number"
              defaultValue={row.quantity}
              onBlur={(e) =>
                dispatch(
                  patchItem({ id: row.id, data: { quantity: Number(e.currentTarget.value) } })
                )
              }
              style={{ width: 80 }}
            />
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => <span>{info.getValue<string>()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original as Row;
          return (
            <button onClick={() => dispatch(removeItem(row.id))}>Delete</button>
          );
        },
      },
    ],
    [dispatch]
  );

  const table = useReactTable({
    data: items as Row[],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <h2>Inventory</h2>
      {status === 'loading' && <p>Loading...</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ borderBottom: '1px solid #ccc', textAlign: 'left', cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  onClick={header.column.getToggleSortingHandler()}
                  aria-sort={
                    header.column.getIsSorted() === 'asc'
                      ? 'ascending'
                      : header.column.getIsSorted() === 'desc'
                      ? 'descending'
                      : 'none'
                  }
                  title={header.column.getCanSort() ? 'Click to sort' : undefined}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' ▲' : header.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: '6px 4px', borderBottom: '1px solid #eee' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
        <span style={{ marginLeft: 8 }}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        >
          {[5, 10, 20, 50].map((ps) => (
            <option key={ps} value={ps}>
              Show {ps}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
