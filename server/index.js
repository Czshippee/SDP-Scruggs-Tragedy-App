const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const gameEngine = require("./gameEngine");

const app = express();
app.use(router);

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: '*', //"http://localhost:3000", //or try *
    methods: ["GET", "POST"],
    allowedHeaders: ["socket-connection-header"],
    credentials: true,
  },
});

const PORT = 5000;

io.on("connection", (socket) => {
  gameEngine.init(io, socket);  
}); 

server.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
});
