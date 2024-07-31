const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const PORT = 5000;

server.listen(PORT,()=>{
    console.log("server is running on port : 5000");
})

const io = new Server(server, {
    cors: {
        origin : "http://localhost:3000",
        methods : ['GET','POST']
    }
})