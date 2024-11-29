"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const chat_socket_1 = __importDefault(require("./sockets/chat.socket"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Crear servidor Express
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/api/chat', chat_routes_1.default);
// Crear servidor HTTP y adjuntar Socket.IO
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:4321', // Ajusta esto según tu frontend
        methods: ["GET", "POST"]
    },
});
// Conectar con MongoDB y arrancar el servidor
const MONGO_URI = process.env.DATABASE_URL;
mongoose_1.default
    .connect(MONGO_URI, { dbName: 'chatroom' })
    .then(() => {
    console.log('Conectado a la base de datos MongoDB');
    // Iniciar Socket.IO
    (0, chat_socket_1.default)(io);
    // Arrancar el servidor Express
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error conectando con MongoDB:', error);
});
