
const socket = io();

// Elements
const $ = function(element){
   return document.querySelector(element);
}

// Auto views auto scrolling

const autoScroll = () => {
     // New Message
     const $newMessage = $('#messages').lastElementChild;

     // Height of the new message
     const newMessageStyles = getComputedStyle($newMessage)
     const newMessageMargin = parseInt(newMessageStyles.marginBottom);
     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
     
     // Visible Height
     const VisibleHeight = $('#messages').offsetHeight;
     
     // Height of messages container
    const containerHeight = $('#messages').scrollHeight;

    // How far have i scrolled
    const scrollOffset = $('#messages').scrollTop + VisibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        $('#messages').scrollTop = $('#messages').scrollHeight;
    }
}

// Message Template
const messageTemplate = $('#message-template').innerHTML;
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        messages: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $('#messages').insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Location Template
const locationTemplate = $('#location-template').innerHTML;
socket.on('locationMessage', (url) => {
     console.log(url)
     const html = Mustache.render(locationTemplate, {
         username: url.username,
         location: url.text,
         createdAt: moment(url.createdAt).format('h:mm a')
     });
     $('#messages').insertAdjacentHTML('beforeend', html)
    autoScroll()
})


// RoomData/sidebar Template
const sidebarTemplate = $('#sidebar-template').innerHTML;
socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
      room, 
      users
  })
  $('#sidebar').innerHTML= html;
})


// Text Event
$('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if($('#message').value == ''){
        return console.log('please provide a input value')
    }
    
    $('#submit').setAttribute('disabled', 'disabled')
    const message = $('#message');
    
    socket.emit('sendMessage', message.value, (error) => {
        $('#submit').removeAttribute('disabled');
        message.value = '';
        message.focus();
        if(error){
            return console.log(error);
        }
        console.log('message delivered');
    })
    
})

// Location event
$('#send-location').addEventListener('click', () => {
  
    if(!navigator.geolocation) {
        return alert('Geolocatin is not supported by your Browser')
    }

    $('#send-location').setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { 
             latitude: position.coords.latitude,
             longitude: position.coords.longitude 
        }, () => {
             $('#send-location').removeAttribute('disabled')
            console.log('location shared')
        });
    })
});

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })
    room.trim().toLowerCase()
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
})

