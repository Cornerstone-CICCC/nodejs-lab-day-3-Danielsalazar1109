import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.routes';
import chatSocket from './sockets/chat.socket';
import dotenv from 'dotenv';
dotenv.config();

// Crear servidor Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/chat', chatRouter);

// Crear servidor HTTP y adjuntar Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', // Ajusta esto según tu frontend
    methods: ["GET", "POST"]
  },
});

// Conectar con MongoDB y arrancar el servidor
const MONGO_URI = process.env.DATABASE_URL!
mongoose
  .connect(MONGO_URI, { dbName: 'chatroom' })
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');

    // Iniciar Socket.IO
    chatSocket(io);

    // Arrancar el servidor Express
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando con MongoDB:', error);
  });