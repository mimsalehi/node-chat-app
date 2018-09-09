const path = require('path');
const express = require('express')
const socketIO = require('socket.io')
const http = require('http');
var {generateMessage, generateLocationMessage} = require('./utils/message')
var {isRealString} = require('./utils/validation')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
const {Users} = require('./utils/user')
var app = express();
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users();

//Broadcasting event

io.on('connection', (socket)=>{
    console.log('New User Connection!')

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('نام خود و اتاق موردنظر را وارد کنید!')
        }

        socket.join(params.room)
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
        callback();
    })

    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    })
    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })
    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left!`))
        }
    })
})
app.use(express.static(publicPath))


server.listen(port, ()=>{
    console.log(`Server is up on ${port}`)
})
