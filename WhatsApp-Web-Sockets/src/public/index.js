let socket = io();
let chatBox = document.getElementById("chatBox");
let sendMessage = document.getElementById("sendMessage");
let log = document.getElementById("log");
let isPressed = false;


let user;

let chatHead = document.getElementsByClassName("chatHead");
let userinitials;
let userProfilePic;

var elem = document.getElementById("message-container");

// Text Image Url 
const getInputMessage = () => {
    chatBox.value = chatBox.value.replace("<", '').replace(">", '');
    // if input starts with http:// or https://, open in new tab
    if (chatBox.value.trim().endsWith(".jpg") || chatBox.value.trim().endsWith(".png") || chatBox.value.trim().endsWith(".gif") || chatBox.value.trim().endsWith(".jpeg")) {
        socket.emit("message", {
            user: user,
            message: chatBox.value.trim(),
            type: "image",
            time: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
        chatBox.value = "";
    }

    else if (chatBox.value.trim().startsWith("https://www.youtube.com/watch?v") || chatBox.value.trim().startsWith("https://youtu.be")) {
        chatBox.value.startsWith("https://www.youtube.com/watch?v") ?
            chatBox.value = chatBox.value.split("watch?v=")[1].split("&")[0]
            :
            chatBox.value = chatBox.value.split("youtu.be/")[1].split("?")[0]
        socket.emit("message", {
            user: user,
            message: chatBox.value.trim(),
            type: "yt-video",
            time: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
        chatBox.value = "";
    }

    else if (chatBox.value.startsWith("http://") || chatBox.value.startsWith("https://")) {
        socket.emit("message", {
            user: user,
            message: chatBox.value.trim(),
            type: "url",
            time: `${new Date().getHours()}:${new Date().getMinutes()}`
        })
        chatBox.value = "";
    }

    else {
        socket.emit('message', {
            user,
            message: chatBox.value.trim(),
            type: "text",
            time: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
        chatBox.value = "";
    }
}

// Send Message
const drawMessageMe = (type, messages) => {
    switch (type) {
        case "image":
            return messages = messages + `
                <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">
                <a target="_blank" href="${log.message}"><img width="100%" src=${log.message}></a>
                </div>
                <div class="time">${log.time}</div>
            </div>
                `
            break;

        case "Url":
            return messages = messages + `
                <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">
                <a target="_blank" href="${log.message}">${log.message}</a>
                </div>
                <div class="time">${log.time}</div>
            </div>
                `
            break;

        default: // text
            return messages = messages + `
                <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">${log.message}</div>
                <div class="time">${log.time}</div>
            </div>
                `
            break;

    }
}

// User Registration
Swal.fire(
    {
        title: 'Bienvenido',
        html: '<p>Escribe tu nombre de usuario</p>',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        allowOutsideClick: false,
        inputValidator: (value) => {
            return !value && '¡No puedes dejar el nombre vacío!'
        }
    }
).then((result) => {
    result.value = result.value.replace("<", '').replace(">", '');
    user = result.value;
});

// Send Message on click
sendMessage.addEventListener('click', function () {
    if (chatBox.value.trim() !== "") {
    getInputMessage();
    }
})

// Send Message on Enter
chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim() !== "") {
            getInputMessage(); // text, image or link message
        }
    }
});


// Sockets
socket.on('log', (data) => {
    console.log(data.time);
    let messages = '';
    data.forEach((log) => {
        if (user === log.user) {
            switch (log.type) {
                case "image": // image
                    return messages = messages + `
                    <div class="chat-bubble me">
                    <div class="my-mouth"></div>
                    <div class="content">
                    <a target="_blank" href="${log.message}"><img width="100%" src=${log.message}></a>
                    </div>
                    <div class="time">${log.time}</div>
                </div>
                    `
                    break;

                case "yt-video": // youtube video
                    return messages = messages + `
                    <div class="chat-bubble me">
                    <div class="my-mouth"></div>
                    <div class="content">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${log.message}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div class="time">${log.time}</div>
                </div>
                    `
                    break;

                case "url": // url
                    return messages = messages + `
                    <div class="chat-bubble me">
                    <div class="my-mouth"></div>
                    <div class="content">
                    <a target="_blank" href="${log.message}">${log.message}</a>
                    </div>
                    <div class="time">${log.time}</div>
                </div>
                    `
                    break;

                default: // text
                    return messages = messages + `
                    <div class="chat-bubble me">
                    <div class="my-mouth"></div>
                    <div class="content">${log.message}</div>
                    <div class="time">${log.time}</div>
                </div>
                    `
                    break;
            }
        }
        else {
            switch (log.type) {
                case "image": // image
                    return messages = messages + `
                        <div class="chat-bubble you">
                        <div class="your-mouth"></div>
                        <h4>${log.user}<h4>
                        <div class="content">
                        <a target="_blank" href="${log.message}"><img width="100%" src=${log.message}></a>
                        </div>
                        <div class="time">${log.time}</div>
                    </div>
                        `
                    break;
    
                case "yt-video": // youtube video
                    return messages = messages + `
                        <div class="chat-bubble you">
                        <div class="your-mouth"></div>
                        <h4>${log.user}<h4>
                        <div class="content">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${log.message}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div class="time">${log.time}</div>
                    </div>
                        `
                    break;
    
                case "url": // url
                    return messages = messages + `
                        <div class="chat-bubble you">
                        <div class="your-mouth"></div>
                        <h4>${log.user}<h4>
                        <div class="content">
                        <a target="_blank" href="${log.message}">${log.message}</a>
                        </div>
                        <div class="time">${log.time}</div>
                    </div>
                        `
                    break;
    
                default: // text
                    return messages = messages + `
                        <div class="chat-bubble you">
                        <div class="your-mouth"></div>
                        <h4>${log.user}</h4>
                        <div class="content">${log.message}</div>
                        <div class="time">${log.time}</div>
                    </div>
                        `
                    break;
            }
        }

    })

    log.innerHTML = messages;
});