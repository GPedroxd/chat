require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = [];

io.on('connection', (socket)=>{
    console.log('conexão detactada!');
    socket.on('join-request', (user)=>{
        socket.userName = user;
        connectedUsers.push(user);
        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: user,
            list: connectedUsers
        });
    });
    socket.on('disconnect', ()=>{
        connectedUsers = connectedUsers.filter(u => u != socket.userName);
        socket.broadcast.emit('list-update', {
            left: socket.userName,
            list: connectedUsers
        });
    });
    socket.on('send', (text) =>{
        let obj = {
            name: socket.userName,
            message: text
        }
        socket.broadcast.emit('show-msg', obj);
    });

});