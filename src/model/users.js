'use strict'
const users = [];
var userD = {};

function user(id,name,room){

     userD = {
             id,
             name,
             room,
             time: new Date().toLocaleTimeString()
             }
     users.push(userD);
     return userD;
}

//get current user
function findCurrentUser(id){
    const currentUser = users.find(user=>user.id===id);
    return currentUser;
}

//get users in room
function roomActiveUsers(room) {
    const activeUsers = users.filter(user=>user.room===room);
    return activeUsers;
    
}

//get disconnected users
function inactiveUsers(id){
    const left = users.findIndex(user=>user.id===id);
    if(left!==-1)
    return users.splice(left, 1)[0];
}

module.exports = {
    user,
    findCurrentUser,
    roomActiveUsers,
    inactiveUsers
};
