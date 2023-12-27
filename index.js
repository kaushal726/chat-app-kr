const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
// const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(server);
let users = {}

io.on('connection', (socket) => {
    // console.log(socket.id);

    socket.on('new-user-joined', (username) => {
        users[socket.id] = username
        socket.broadcast.emit('user-connected', username);
        io.emit('user-list', users)

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', user = users[socket.id]);
            delete users[socket.id];
            io.emit('user-list', users)
        })
    })

    socket.on('user-message', (obj) => {
        socket.broadcast.emit('message', obj)
    })
})



server.listen(PORT, () => {
    // console.log(`Server Started at ${PORT}`);
})