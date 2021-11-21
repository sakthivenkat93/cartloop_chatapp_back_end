const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, { 'cors': { 'methods': ['GET', 'PATCH', 'POST', 'PUT'], 'origin': 'http://localhost:3000' } });

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
})

io.on('connect', (socket) => {
  io.emit('broadcast', '[Server]: Welcome stranger!');
  console.log('incoming connection');

  socket.on('message', (msg) => {
    console.log(`message received from user: ${msg.from}`);
    console.log(`message received content: ${msg.content}`);
    console.log(msg);
    io.emit('message', msg);
  });

  socket.on('disconnect', function () {
    io.emit('broadcast', '[Server]: Bye, bye, stranger!');
  });
});

const port = process.env.PORT || 3001;
app.set('port', 8081);

http.listen(8081, () => {
  console.log('listening on *:8081');
});