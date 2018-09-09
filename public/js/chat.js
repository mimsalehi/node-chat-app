var socket = io();

function scrollFunction(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight') ;

    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHiehgt = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHiehgt >= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function(){
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No error')
        }
    })
})

socket.on('disconnect', function(){
    console.log('Disconnected from server');
})

socket.on('updateUserList', function(users){
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user))
    })
    jQuery('#users').html(ol)
})
socket.on('newMessage', function(message){
    var formatedTime = moment(message.createdAt).format('hh:mm a')
    var template = jQuery('#message-template').html()  
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    })
    jQuery('#messages').append(html)
    scrollFunction();
})

socket.on('newLocationMessage', function(message){
    var formatedTime = moment(message.createdAt).format('hh:mm a')
    var template = jQuery('#location-message-template').html()  
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formatedTime
    })
    jQuery('#messages').append(html)
    scrollFunction();
})


jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    var message = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: message.val()
    }, function(){
        message.val('')
    })
})

var loactionButton = jQuery('#send-location');
loactionButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    loactionButton.attr('disabled', 'disabled').text('Sending Location ...')
    navigator.geolocation.getCurrentPosition(function(position){
        loactionButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        loactionButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location')
    });
})