const express = require('express')
const app = express()
const http = require("http")
const socketio = require("socket.io")
const path = require("path");
const server = http.createServer(app);
const io = socketio(server)


app.use(express.static('public')); 

app.set("view engine", "ejs");
// app.set(express.static(path.join(__dirname, "public")));



io.on("connection", function (socket) {
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id, ...data});
    })
    socket.on("disconnect",function () {
        io.emit("user-disconnected",socket.id);
    })

})

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(3000);
