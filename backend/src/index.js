require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const itemsRouter = require('./routes/items');
const auth = require('./middleware/auth');

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
