const chatData = {
    user:"",
    members:{},
    messages:{},
    alerts:{}
}

const DOM = {
    loginScreen:document.querySelector('.login-screen'),
    errorMessage:document.querySelector('.error-message'),
    login:document.querySelector('.login input'),
    input: document.querySelector('.message-input'),
};

const SMILES_LIST = {
    ';*': '&#128536;',
    ':D': '&#128512;',
    'xD': '&#128518;',
    '<3': '&#128151;',

};

function parserMessage(message) {
    let smiles = Object.keys(SMILES_LIST);
    smiles.forEach(smile => message = message.replace(smile, SMILES_LIST[smile]));
    return message;
}

function sendMessage(to="Todos"){

    const message = DOM.input.value;
    console.log(message)
    if (message === '') {
        return;
    }

    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", {
        from: chatData.user,
        to: "Todos",
        text: message,
        type: "message"
    })
    .then(getMessages);
    DOM.input.value = '';
}



function requestLogin(){

    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{
        name: DOM.login.value
    })
    .then(res=> {
        console.log(res.data)
        chatData.user=DOM.login.value;
        loadChat()
        

    })
    .catch(error=> {
        if(error.response.status===400){
            DOM.errorMessage.classList.remove("hide")
        }
    });
        
}

function getMessages(){

    axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    .then(renderMessages)
    .catch(error=>console.log(error));
        
}


function renderMessages(messages) {
    console.log(messages.data)
    console.log("renderizando aqui, mas né")
    const textMessages = document.querySelector(".text-messages")
    textMessages.innerHTML = "";
    messages.data.filter(message => message.to == "Todos" || message.to === chatData.user )
     .forEach(message => {
        textMessages.innerHTML += `
            <li class="message">
                <span><span class="horario">(${message.time})</span>  <strong>${message.from}</strong> para <strong>${message.to}</strong>: ${parserMessage(message.text)}</span>
            </li>`;
        });
    textMessages.innerHTML +=`<li></li><li></li>`
    window.scroll(0, document.body.scrollHeight);
    

}


/*Make user online until page is closed obvs */

function sendStatus() {
     axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {'name':chatData.user});
    
}


function loadChat() {
    getMessages();
    DOM.loginScreen.classList.add("hide")
    onlineUsers();
    setInterval(sendStatus, 5000);
    setInterval(getMessages, 3000);
    //setInterval(chatEvents, 10000);
}

function chatEvents(){

    oldmembers=chatData.members;
    onlineUsers()
    left = oldmembers.filter(x => chatData.members.indexOf(x) === -1);
    joined = chatData.members.filter(x => oldmembers.indexOf(x) === -1);
    console.log(left);
    console.log(joined);
}

function onlineUsers() {

    axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    .then(res=> chatData.members=res.data)
    .catch(error=>console.log(error));

    /*this catch above is only for debug purposes.*/
        
}