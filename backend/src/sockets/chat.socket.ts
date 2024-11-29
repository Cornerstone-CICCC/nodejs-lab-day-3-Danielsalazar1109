import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async (room: string) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);

      const messages = await Chat.find({ room });
      socket.emit('previousMessages', messages); 

      socket.to(room).emit('userJoined', `${socket.id} has joined the room`);
    });

    socket.on('sendMessage', async (data) => {
      const { room, username, message } = data;

      try {
        const chat = new Chat({ username, message, room });
        await chat.save();
        io.to(room).emit('newMessage', { username, message });

      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;
