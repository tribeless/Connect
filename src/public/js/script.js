'use strict'

$(document).ready(()=>{
    
    //getting the input values
    const {name, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

    appendAllMessages(`${name} welcome to ${room} room`);

    //connecting to socket.io client
    const socket = io();
     
    //users messages
    $("#index").submit((e) => {
        e.preventDefault();
        var message = document.querySelector("#m").value;
        
        appendAllMessages(`You:${message}`)
        //emiting to server
        socket.emit("user message",message);
         let a = document.querySelector(".lists");
         a.scrollTop = a.scrollHeight;
        $("#m").val(" ");
        return false;
       
    });

    //emiting room details
    socket.emit("details", {
        name,
        room
    });
      
    //users messages
    socket.on("message",msg=>{
       appendAllMessages(msg);
    });
    
    //message from server
    socket.on("new message",msg=>{
        toastMakerLeft(msg);
    });

     socket.on("personal", name => {
         //appendAllMessages(msg);
         toastMaker(name);
     });
  
     //handle the common message
     socket.on("common-message",msg=>{
         $(".h1").html(msg);
     });

     //display a list of all active room members
     socket.on("all-users",({users})=>{
        all(users)
     });
});

//appends all messages from server to client
function appendAllMessages(msg){
    $("#chat-list").append($("<li class='lists list-group-item d-flex justify-content-between align-items-center msg'></li>").html(msg));
}

//display list of all active users
function all(users){
    const list = document.querySelector(".active-users");
    list.innerHTML = ` ${users.map(user=> `<li style="list-style-type:none;text-align:center; class="users">${user.name}</li>`).join("")}`;
}

//create a toast
function toastMaker(name) {
    $(".toast_user").addClass('open')
    $(".toast_user").html(name).fadeIn(2000).fadeOut(2000);
}

//toast for user left
function toastMakerLeft(name) {
    $(".toast_user").addClass('open')
    $(".toast_user_left").html(name).fadeIn(2000).fadeOut(2000);
}


