const path = require('path');
const express = require('express')
const socketIO = require('socket.io')
const http = require('http');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app)
var io = socketIO(server)

io.on('connection', (socket)=>{
    console.log('New User Connection!')

    socket.on('disconnect', ()=>{
        console.log("User was disconnected!");
    })
})
app.use(express.static(publicPath))


server.listen(port, ()=>{
    console.log(`Server is up on ${port}`)
})