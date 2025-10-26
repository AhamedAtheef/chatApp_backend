// socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://pingmeapp.vercel.app"],
        credentials: true
    }
});

// used to get the socket id of a user
export function getReceiver(userId) {
    return userSocketMap[userId];
}
// used to store online users
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // 1. Read the 'userId' sent from the client's connection query.
    // (Correction 1: Matches the key 'userId' sent by the client)
    const userId = socket.handshake.query.userId;

    // 2. If a userId was provided, map it to the unique socket.id for this connection.
    if (userId) userSocketMap[userId] = socket.id;

    // 3. Broadcast the 'Online Users' event to ALL connected clients.
    //    The payload is an array of all user IDs currently in the map.
    io.emit("Online Users", Object.keys(userSocketMap));

    // 4. Set up a listener for when THIS specific client disconnects.
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);

        // 5. Remove the disconnected user from the map.
        delete userSocketMap[userId];

        // 6. Broadcast the UPDATED list of online users to ALL remaining clients.
        // (Correction 3: Uses the correct event name 'Online Users')
        io.emit("Online Users", Object.keys(userSocketMap));
    });
});

export { io, app, server };
