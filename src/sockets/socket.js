const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');
const jwtService = require('../services/jwt');

module.exports = (httpServer) => {
    const io = new Server(httpServer, { cors: { origin: '*' } });


    if (process.env.REDIS_HOST) {
        io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));
    }

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Auth error'));
        try {
            const payload = jwtService.verifyAccess(token);
            socket.userId = payload.sub;
            return next();
        } catch (err) { return next(new Error('Auth error')); }
    });

    io.on('connection', (socket) => {
        console.log('connected', socket.userId);


        socket.join(`user:${socket.userId}`);

        socket.on('joinConversation', ({ conversationId }) => {
            socket.join(`conversation:${conversationId}`);
        });

        socket.on('message:create', async (payload) => {
            const saved = { id: 'msg-id', ...payload, createdAt: new Date() };
            io.to(`conversation:${payload.conversationId}`).emit('message:new', saved);
            socket.emit('message:ack', { clientId: payload.clientId, serverId: saved.id });
        });

        socket.on('typing', ({ conversationId, isTyping }) => {
            socket.to(`conversation:${conversationId}`).emit('typing', { userId: socket.userId, isTyping });
        });

        socket.on('disconnect', () => {
            console.log('disconnected', socket.userId);
        });
    });

    return io;
};
