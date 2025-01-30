const socket = io();

let username;


let chatsEl = document.querySelector('.chats');
let userCountEl = document.querySelector('.user-count');
let usersListEL = document.querySelector('.users-list');
let usersMsgEL = document.querySelector('#user-msg');
let usersSendEL = document.querySelector('#user-send');
let typing = document.querySelector('#typing');



do {
    username = prompt("Enter your name : ");
} while (!username)



socket.emit('new-user-joined', username);
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, "joined");
})
socket.on('user-disconnected', (username) => {
    userJoinLeft(username, "left");
})

socket.on('user-typing-on', (username) => {
    typing.innerHTML = "";
    typing.innerHTML = "Someone is Typing...";

})

socket.on('user-typing-off', (username) => {
    typing.innerHTML = "";
})


let userJoinLeft = (name, status) => {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b>${name} </b> ${status} the Chat`;
    div.innerHTML = content;
    chatsEl.appendChild(div);
    chatsEl.scrollTop = chatsEl.scrollHeight

}

socket.on('user-list', (userList) => {
    let usernames = Object.values(userList);
    usersListEL.innerHTML = "";
    usernames.map(name => {
        let p = document.createElement('p');
        p.id = name;
        p.innerHTML = name;
        if (name == username) {
            p.classList.add('your-name');
        }
        usersListEL.appendChild(p)
    })
    userCountEl.innerHTML = usernames.length;
})

usersMsgEL.addEventListener('input', (e) => {
    socket.emit("typing-on", username)
})

usersMsgEL.addEventListener('blur', (e) => {
    socket.emit("typing-off", username)
})


// let handleInput = (e) => {
//     let message = usersMsgEL.value;
//     let obj = {
//         name: username,
//         message: message
//     }
//     if (message !== "") {
//         socket.emit('user-message', obj)
//         createMessage(obj, 'outgoing');
//         usersMsgEL.value = ''
//     }
// }

let handleInput = (e) => {
    if (e.type === 'click' || (e.type === 'keyup' && (e.key === 'Enter' || e.code === 'Enter'))) {
        let message = usersMsgEL.value;
        let obj = {
            name: username,
            message: message
        };

        if (message.trim() !== "") {
            socket.emit('user-message', obj);
            createMessage(obj, 'outgoing');
            usersMsgEL.value = '';
            socket.emit("typing-off", username)
        }
    }
};

usersSendEL.addEventListener('click', handleInput);
document.addEventListener('keyup', handleInput);


socket.on('message', (message) => {
    createMessage(message, 'incoming');
})

let createMessage = (message, status) => {
    let div = document.createElement('div');
    let header = document.createElement('h5');
    let p = document.createElement('p');
    div.classList.add('message', status);
    header.innerHTML = message.name;
    p.innerHTML = message.message;
    div.appendChild(header);
    div.appendChild(p);
    chatsEl.appendChild(div);
    if (chatsEl.children.length > 15) {
        chatsEl.removeChild(chatsEl.firstChild);
    }
    chatsEl.scrollTop = chatsEl.scrollHeight
}