import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';


interface Asset {
    id: number;
    name: string;
    value: number;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const portfolio: Asset[] = []; // Начальное состояние портфеля

io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    // Отправка текущего портфеля клиенту
    socket.emit('portfolioUpdate', portfolio);

    socket.on('addAsset', (newAsset: Asset) => {
        portfolio.push(newAsset);
        io.emit('portfolioUpdate', portfolio); // Обновление всех клиентов
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
