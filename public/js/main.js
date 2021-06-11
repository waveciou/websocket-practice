const CHAT_FORM = document.getElementById('chat-form');
const CHAT_MESSAGES = document.querySelector('.chat-messages');
const ROOM_NAME = document.getElementById('room-name');
const USER_LIST = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log('Message From Server:', message);
  outputMessage(message);

  // Scroll down
  CHAT_MESSAGES.scrollTop = CHAT_MESSAGES.scrollHeight;
});

// Message submit
CHAT_FORM.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear Input
  e.target.elements.msg.value = '';
});

// Output message to DOM
function outputMessage(message) {
  const dom = document.createElement('div');
  dom.classList.add('message');

  dom.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `;

  CHAT_MESSAGES.appendChild(dom);
}

// Add room name to DOM
function outputRoomName(room) {
  ROOM_NAME.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  USER_LIST.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
