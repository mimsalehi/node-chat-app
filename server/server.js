const path = require('path');
const express = require('express')
const socketIO = require('socket.io')
const http = require('http');
var {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app)
var io = socketIO(server)

//Broadcasting event

io.on('connection', (socket)=>{
    console.log('New User Connection!')


    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('createMessage', (message)=>{
        console.log('createMessage', message)
        io.emit('newMessage', generateMessage(message.from, message.text));
        
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })
    
    socket.on('disconnect', ()=>{
        console.log("User was disconnected!");
    })
})
app.use(express.static(publicPath))


server.listen(port, ()=>{
    console.log(`Server is up on ${port}`)
})
