import { io, Socket } from 'socket.io-client';
import type { AppDispatch } from './store';
import { deleteFromSocket, upsertFromSocket } from './slices/itemsSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function initSocket(dispatch: AppDispatch) {
  if (socket) return socket;
  socket = io(API_URL, { transports: ['websocket'] });
  socket.on('item:created', (item) => dispatch(upsertFromSocket(item)));
  socket.on('item:updated', (item) => dispatch(upsertFromSocket(item)));
  socket.on('item:deleted', ({ id }) => dispatch(deleteFromSocket(id)));
  return socket;
}
