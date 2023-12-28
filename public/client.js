const socket = io();

let username;


let chatsEl = document.querySelector('.chats');
let userCountEl = document.querySelector('.user-count');
let usersListEL = document.querySelector('.users-list');
let usersMsgEL = document.querySelector('#user-msg');
let usersSendEL = document.querySelector('#user-send');


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
        p.innerHTML = name;
        if (name == username) {
            p.classList.add('your-name');
        }
        usersListEL.appendChild(p)
    })
    userCountEl.innerHTML = usernames.length;
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
    chatsEl.scrollTop = chatsEl.scrollHeight
}