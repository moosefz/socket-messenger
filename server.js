// setup
const path      = require("path"),
      http      = require("http"),
      express   = require("express"),
      socketio  = require("socket.io");


// enable express
const app = express();
const server = http.createServer(app); // create express server
const io = socketio(server); // socket.io server

// Set static folder for html/css
app.use(express.static(path.join(__dirname, "public")));

// port or environment var port
const PORT = 3000 || process.env.PORT;

// Run socket io when client connects - handles all bi-directional communication
io.on("connection", socket => {
    
    // Welcome current user
    socket.emit("message", "Welcome to Socket Messenger!");

    // Broadcast when a user connects - to everyone but local user
    socket.broadcast.emit("message", "A user has joined the chat");
    
    // When client disconnects
    socket.on("disconnect", () => {
        io.emit("message", "A user has left the chat");
    });

    // Listen for chat messages - emit to server for all
    socket.on("chatMessage", (msg) => {
        io.emit("message", msg);
    })
})

// ===== ROUTES ===== //


// listener
server.listen(PORT, () => {
    console.log("Socket Messenger running on port " + PORT);
})