const path = require('path');
const express = require('express')
const socketIO = require('socket.io')
const http = require('http');
var {generateMessage, generateLocationMessage} = require('./utils/message')
var {isRealString} = require('./utils/validation')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app)
var io = socketIO(server)

//Broadcasting event

io.on('connection', (socket)=>{
    console.log('New User Connection!')

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('نام خود و اتاق موردنظر را وارد کنید!')
        }
        socket.join(params.room)
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
        callback();
    })

    socket.on('createMessage', (message, callback)=>{
        console.log('createMessage', message)
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    })
    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })
    socket.on('disconnect', ()=>{
        console.log("User was disconnected!");
    })
})
app.use(express.static(publicPath))


server.listen(port, ()=>{
    console.log(`Server is up on ${port}`)
})
