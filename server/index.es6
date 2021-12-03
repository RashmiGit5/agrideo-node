import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import apiV1 from "./apis/v1";

import { createServer } from "http";
import { Server } from "socket.io";

import { chatSendMsg, messageReceiveStstusUpdate, messageReadAllMessage, messageReceivedAllMessage } from "./modules/v1/chat/services/chat.service"

const port = 5001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  }
});

io.on("connection", (socket) => {
  console.log('A user connected');

  socket.on('send_message', (data) => {
    chatSendMsg(io, data)
  });

  socket.on('message_received', (data) => {
    messageReceiveStstusUpdate(io, data)
  });

  socket.on('message_read_all', (data) => {
    messageReadAllMessage(io, data)
  });

  socket.on('join', function (data) {
    messageReceivedAllMessage(io, { user_id: data })
    socket.join(`${data}`)
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

app.set('socketio', io);

httpServer.listen(3000);

// app.get('/', function (req, res) {
//   res.sendFile('/Users/mini-1/Projects/Agrido/agrideo-node/index.html');
// });


// 3rd party middleware
app.use(
  cors({
    exposedHeaders: ["Link"]
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json({ limit: "50MB" }));
app.use(express.static(path.join(__dirname, "public")));


const server = app.listen(port, () => {
  console.log('\x1b[33m%s\x1b[0m', `Port listen on :  ${port}`);
});

// for prod build
app.use('/api/v1', apiV1());

export default app;
