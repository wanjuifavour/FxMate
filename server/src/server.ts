import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import forexRoutes from './routes/forex';
import { connectToTiingo } from './websockets/tiingoWebSocket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
export const prisma = new PrismaClient();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/forex', forexRoutes);

connectToTiingo(io);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('message', (message) => {
        console.log('Received:', message);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});