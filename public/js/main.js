const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

// message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message);

    // scroll down on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value; // extract msg
    socket.emit("chatMessage", msg); // emit msg to server

        // clear input once message sent and focus
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
})

// output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");

    // format new chat message
    div.innerHTML = "<p class='meta'>Brad <span>9:12pm</span></p><p class='text'>" + message + "</p>";
    document.querySelector(".chat-messages").appendChild(div);
}

