import express from "express";
import { connect } from "rxjs";
import { Server, Socket } from "socket.io";
import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, visit http://localhost:${PORT}`);
});
app.use(express.static(__dirname + "/public"));
const io = new Server(server);  //SocketServer  

const log = [];
io.on('connection', socket => {
    socket.on('message', data => {
        log.push(data);
        io.emit('log', log );
    });
});
