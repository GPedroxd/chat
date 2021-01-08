const socket = io();

let userName = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let chatInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUsers(){
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';
    userList.forEach(i =>{
        ul.innerHTML += `<li>${i}</li>`;
    });
}
function addMessage(type, user, message){
    let ul = document.querySelector('.chatList');
    switch(type){
        case 'status':
            ul.innerHTML += `<li class="m-status"> ${message} </li>`;
            break;
        case 'message':
            if(user == userName){
                ul.innerHTML += `<li class="m-txt"> <span class="me">${user}</span> ${message} </li>`;
            }else{
                ul.innerHTML += `<li class="m-txt"> <span>${user}</span> ${message} </li>`;
            }
            
            break;
    }
}

loginInput.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        let name = loginInput.value.trim();
        if(name){
            userName = name;
            document.title = `chat - ${name}`;
            socket.emit('join-request', userName);
        }
    }
});
chatInput.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        let text = chatInput.value.trim();
        chatInput.value = '';
        if(text){
            addMessage('message', userName, text);
            socket.emit('send', text);
        }
    }
});

socket.on('user-ok', (users)=>{
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    chatInput.focus();
    addMessage('status', null, 'Conectado!');
    userList = users;
    renderUsers();
});
socket.on('list-update', (data)=>{
    if(data.joined){
        addMessage('status', null, `${data.joined} entrou no chat!`);
    }
    if(data.left){
        addMessage('status', null, `${data.left} saiu do chat!`);
    }
    userList = data.list;
    renderUsers();

});
socket.on('show-msg', (data)=>{
    addMessage('message', data.name, data.message);
});
socket.on('disconnect', ()=>{
    addMessage('status', null, 'Você foi desconectdo');
    userList = [];
    renderUsers();
});
socket.on('reconnect_error', ()=>{
    addMessage('status', null, 'Reconectando...');
});
socket.on('reconnect', ()=>{
    addMessage('status', null, 'Reconectado!');
    if(userName){
        socket.emit('join-request', userName);
    }
});
