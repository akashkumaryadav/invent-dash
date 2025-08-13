require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const itemsRouter = require('./routes/items');
const auth = require('./middleware/auth');
const store = require('./store/itemsStore');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

// Expose io to routes via app locals for broadcasting
app.locals.io = io;

// Middleware
app.use(cors());
app.use(express.json());

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Authenticated routes
app.use('/items', auth, itemsRouter);

const PORT = process.env.PORT || 4000;

function start() {
  return new Promise((resolve) => {
    // Seed demo data if empty
    if (store.list().length === 0) {
      store.seedDefaults([
        { name: 'Widget A', quantity: 12, category: 'Hardware' },
        { name: 'Widget B', quantity: 7, category: 'Hardware' },
        { name: 'Sprocket X', quantity: 20, category: 'Components' },
        { name: 'Sprocket Y', quantity: 5, category: 'Components' },
        { name: 'Tape Roll', quantity: 30, category: 'Supplies' },
        { name: 'Label Pack', quantity: 18, category: 'Supplies' },
      ]);
    }
    server.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// Socket.io connection logging
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

if (require.main === module) {
  start();
}

module.exports = { app, server, start };
