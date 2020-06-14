// all user configurations - can use db if needed
const users = [];

// join user to chat
function userJoin(id, username, room) {
    const user = {
        id,
        username,
        room
    }
    users.push(user);
    return user;
}

// get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    // if user exists in the array
    if(index !== -1) {
        // remove the user
        return users.splice(index, 1)[0];
    }
}

// get all users in a room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// export methods to server
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}