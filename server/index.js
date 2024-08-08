const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("addComment", (data) => {
    io.emit("commentAdded", data);
  });

  socket.on("voteComment", (data) => {
    io.emit("voteComment", data);
  });

  socket.on("resetVotes", () => {
    io.emit("resetVotes");
  });

  socket.on("nextStep", () => {
    io.emit("nextStep");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
