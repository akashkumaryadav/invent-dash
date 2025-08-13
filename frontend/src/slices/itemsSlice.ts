import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../api/client';
import { addItem, deleteItem, fetchItems, updateItem } from '../api/client';

export type ItemsState = {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  query: string;
};

const initialState: ItemsState = {
  items: [],
  status: 'idle',
  query: '',
};

export const loadItems = createAsyncThunk('items/load', async (q?: string) => {
  const data = await fetchItems(q);
  return data;
});

export const createItem = createAsyncThunk('items/create', async (data: Omit<Item, 'id'>) => {
  const res = await addItem(data);
  return res;
});

export const patchItem = createAsyncThunk(
  'items/update',
  async ({ id, data }: { id: string; data: Partial<Omit<Item, 'id'>> }) => {
    const res = await updateItem(id, data);
    return res;
  }
);

export const removeItem = createAsyncThunk('items/delete', async (id: string) => {
  await deleteItem(id);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    upsertFromSocket(state, action: PayloadAction<Item>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx === -1) state.items.push(action.payload);
      else state.items[idx] = action.payload;
    },
    deleteFromSocket(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx === -1) state.items.push(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(patchItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { setQuery, upsertFromSocket, deleteFromSocket } = itemsSlice.actions;
export default itemsSlice.reducer;
