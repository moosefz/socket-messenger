// setup
const path = require("path"),
      http = require("http"),
      express = require("express"),
      socketio = require("socket.io"),
      formatMessage = require("./utils/messages"),
      { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");


// enable express
const app = express();
const server = http.createServer(app); // create express server
const io = socketio(server); // socket.io server

const botName = "SocketBot";

// Set static folder for html/css
app.use(express.static(path.join(__dirname, "public")));

// port or environment var port
const PORT = 3000 || process.env.PORT;

// Run socket io when client connects - handles all bi-directional communication
io.on("connection", socket => {

    // when user joins a room
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room); // join room

        // Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to Socket Messenger!"));

        // Broadcast when a user connects - to everyone but local user in a specific room
        socket.broadcast.to(user.room).emit("message", 
            formatMessage(botName, user.username + " has joined the chat"));

        // send users and info
        io.to(user.room).emit("roomUsers", { 
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });


    // Listen for chat messages - emit to server for all
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // When client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit("message", formatMessage(botName, user.username + " has left the chat"));
        };

        // send users and info
        io.to(user.room).emit("roomUsers", { 
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
})

// ===== ROUTES ===== //


// listener
server.listen(PORT, () => {
    console.log("Socket Messenger running on port " + PORT);
})