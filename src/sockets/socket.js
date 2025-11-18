const { Server } = require("socket.io");
const redisAdapter = require("socket.io-redis");
const jwtService = require("../services/jwt");
const { Message } = require("../models");
const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || null
});

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        cors: { origin: "*" },
        pingInterval: 25000,
        pingTimeout: 60000
    });

    // Redis Adapter for horizontal scaling
    if (process.env.REDIS_HOST) {
        io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));
        console.log("Socket.IO using Redis adapter");
    }

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("Authentication failed"));

            const payload = jwtService.verifyAccess(token);
            socket.userId = payload.sub;

            return next();
        } catch (err) {
            return next(new Error("Invalid Token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.userId);

        socket.join(`user:${socket.userId}`);

        socket.on("joinConversation", ({ conversationId }) => {
            socket.join(`conversation:${conversationId}`);
        });

        socket.on("message:create", async (payload) => {
            try {

                const existingServerId = await redis.get(`msg:${payload.clientId}`);
                if (existingServerId) {
                    return socket.emit("message:ack", {
                        clientId: payload.clientId,
                        serverId: Number(existingServerId)
                    });
                }

                const message = await Message.create({
                    senderId: payload.senderId,
                    receiverId: payload.receiverId,
                    content: payload.content,
                    timestamp: new Date()
                });

                const serverMessageId = message.id;

                await redis.set(
                    `msg:${payload.clientId}`,
                    serverMessageId,
                    "EX",
                    60 * 60 * 24
                );

                io.to(`conversation:${payload.conversationId}`).emit("message:new", {
                    id: serverMessageId,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    content: message.content,
                    timestamp: message.timestamp,
                    clientId: payload.clientId
                });

                socket.emit("message:ack", {
                    clientId: payload.clientId,
                    serverId: serverMessageId
                });

            } catch (err) {
                console.log("Message Create Error:", err);

                socket.emit("message:retry", {
                    clientId: payload.clientId,
                    retryAfter: 500
                });
            }
        });

        socket.on("typing", ({ conversationId, isTyping }) => {
            socket.to(`conversation:${conversationId}`).emit("typing", {
                userId: socket.userId,
                isTyping
            });
        });

        redis.sadd("onlineUsers", socket.userId);

        socket.on("disconnect", async () => {
            redis.srem("onlineUsers", socket.userId);
            console.log("Socket disconnected:", socket.userId);
        });
    });

    return io;
};
