'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var loginForm = document.querySelector('#loginForm');
var messageForm = document.querySelector('#messageForm');
var exitForm = document.querySelector('#exitForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var username;
var validUser = false;

var stompClient = null;
var username = null;
var subscription = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

//function to validate login
function validateLogin(event){
	event.preventDefault();
	var email = document.querySelector('#email').value;
	var password = document.querySelector('#password').value
	var data = new FormData();
	data.append("email",email);
	data.append("password",password);
	
	var xhr = new XMLHttpRequest();
	var url = "http://localhost:8080/api/login"
	
	
	xhr.open("POST",url,true);
	xhr.send(data);
	
	xhr.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var res = JSON.parse(this.responseText);
			if(res.code){
				username = res.result[0].username;
				validUser = true;
				connect();
				connect
			}
			else{
				username = "";
				validUser = false
				alert("Invalid username/password");
			}
			
		}
	}
	
}

function connect() {
//    username = document.querySelector('#name').value.trim();

    if(validUser) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, onConnected, onError);
    }
    //event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public room
    stompClient.subscribe('/public/room', onMessageReceived);
    

    // Tell your username to the server
    stompClient.send("/app/chat.register",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function send(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function logout(){
	subscription.unsubscribe()
	
}




loginForm.addEventListener('submit', validateLogin, true)
messageForm.addEventListener('submit', send, true)
exitForm.addEventListener('submit', logout, true)
