'use strict'
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

//Middleware
app.use(express.static(path.join(__dirname, "src")));
app.use(express.static("src/views"));

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));
require("dotenv").config();

//users 
const {
    user,
    findCurrentUser,roomActiveUsers,
    inactiveUsers
} = require("./src/model/users");

//messages func
const appendMessages = require("./src/model/messages");


//setting up the connection
io.on("connection",socket=>{
    
//receiving room and usernames details
socket.on("details",({name,room})=>{

        const userDetails = user(socket.id,name,room);

        socket.join(userDetails.room);

        socket.to(userDetails.room).emit("personal",appendMessages(`${userDetails.name} has joined the room`));

        io.to(userDetails.room).emit("common-message",appendMessages(`Welcome to ${userDetails.room} room`));

        io.to(userDetails.room).emit("all-users", {users:roomActiveUsers(userDetails.room)});
        
            
    });

//receiving user messages
    socket.on("user message", message => {
        const user = findCurrentUser(socket.id);
        socket.to(user.room).emit("message", appendMessages(`${user.name}:${message}`));
        
    });

//disconnecting a user from the db
    socket.on("disconnecting", ()=>{
        const leftUsers = inactiveUsers(socket.id);
        if(leftUsers){
        io.to(leftUsers.room).emit("new message",appendMessages(`${leftUsers.name} has left the room`));

        //remove the user from list of active users
        io.to(leftUsers.room).emit("all-users", {users:roomActiveUsers(leftUsers.room)});
        }
    });
});

server.listen(process.env.PORT);
