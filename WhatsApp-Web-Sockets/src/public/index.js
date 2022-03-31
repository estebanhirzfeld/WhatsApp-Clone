let socket = io();
let chatBox = document.getElementById("chatBox");
let log = document.getElementById("log");


let user;

let chatHead = document.getElementsByClassName("chatHead");
let userinitials;
let userProfilePic;

var elem = document.getElementById("message-container");


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
    user = result.value;
});

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim() !== "") {

            // if input ends in .jpg, .png, .gif, .jpeg
            if (chatBox.value.trim().endsWith(".jpg") || chatBox.value.trim().endsWith(".png") || chatBox.value.trim().endsWith(".gif") || chatBox.value.trim().endsWith(".jpeg")) {
                socket.emit("message", {
                    user: user,
                    message: chatBox.value.trim(),
                    type: "image"    
                });
                chatBox.value = "";
            }else{
                socket.emit('message', { user, message: chatBox.value.trim() });
                chatBox.value = "";
            }

        }
    }
});

// Sockets

socket.on('log', (data) => {
    
    let messages = '';
    data.forEach((log) => {

        if (user === log.user) {

            if (log.type != "image") {
                messages = messages + `
                <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">${log.message}</div>
                <div class="time">2:40</div>
            </div>
                `

            } else {
                messages = messages + `
                <div class="chat-bubble me">
                <div class="my-mouth"></div>
                <div class="content">
                <a target="_blank" href="${log.message}"><img width="100%" src=${log.message}></a>
                </div>
                <div class="time">2:40</div>
            </div>
                `
            }

        } else {

            if (log.type != "image") {
                messages = messages + `
                <div class="chat-bubble you">
                <div class='your-mouth'></div>
                <h4>${log.user}</h4>
                <div class="content">${log.message}</div>
                <div class="time">2:41</div>
                </div>
                `
            } else {
                messages = messages + `
                <div class="chat-bubble you">
                <div class="my-mouth"></div>
                <h4>${log.user}</h4>
                <div class="content">
                <a target="_blank" href="${log.message}"><img width="100%" src=${log.message}></a>
                </div>
                <div class="time">2:40</div>
            </div>
                `
            }


        }


    })




    log.innerHTML = messages;
});