$(document).ready( () => {
    // connect to the sockt.io Server
    const socket = io.connect();
    let currentUser;
    socket.emit('get online users');
    //Each user should be in the general channel by default.
    socket.emit('user changed channel', "General");

    //Users can change the channel by clicking on its name.
    $(document).on('click', '.channel', (e)=>{
        let newChannel = e.target.textContent;
        socket.emit('user changed channel', newChannel);
    });
    // get the online users from the server
    socket.emit('get online users', (onlineUsers) => {
        for (username in onlineUsers) {
            $('users-online').append(`<div class="user-online">${username}</div>`)
        }
    })
    
    $('#create-user-btn').click((e)=>{
        e.preventDefault();
        if($('#username-input').val().length > 0){
            socket.emit('new user', $('#username-input').val());
            // Save the current user when created
            currentUser = $('#username-input').val();
            // $('.username-form').remove();
            // $('.username-form').css('display', 'none');
            // $('.main-container').css('display', 'flex');
            $('#username-form').addClass('is-hidden')
            $('#main-container').removeClass('is-hidden')
        }
    });

    $('#send-chat-btn').click((e) => {
        e.preventDefault();
        // get the clien's channel
        let channel = $('.channel-current').text()
        // Get the message text value
        let message = $('#chat-input').val();
        // Make sure it's not empty
        if(message.length > 0){
            // Emit the message with the current user to the server
            socket.emit('new message', {
                sender : currentUser,
                message : message,
                channel: channel
            });
            $('#chat-input').val("");
        }
    })

    $('#new-channel-btn').click( () => {
        let newChannel = $('#new-channel-input').val()

        if (newChannel.length > 0) {
            // emit the new channel to the server
            socket.emit('new channel', newChannel)
            $('#new-channel-input').val("")
        }
    })

    //socket listeners
    socket.on('new user', (data) => {
        console.log(`${data.username} has joined the chat`);
        $('.users-online').append(`<div class="user-online">${data.username}</div>`);
        // for (channel in data.channels) {
        //     if (channel != "General") {
        //         $('.channels').append(`<div class="channel">${channel}</div>`)
        //     }
        // }
    })

    //Output the new message
    socket.on('new message', (data) => {
        let currentChannel = $('.channel-current').text()
        if (currentChannel == data.channel) {
            $('.message-container').append(`
            <div class="message">
                <p class="message-user">${data.sender}: </p>
                <p class="message-text">${data.message}</p>
            </div>
            `);
        }
    })

    //Refresh the online user list
    socket.on('user has left', (onlineUsers) => {
        $('.users-online').empty();
        for(username in onlineUsers){
            $('.users-online').append(`<p>${username}</p>`);
        }
    });

    socket.on('new channel', (newChannel) => {
        $('.channels').append(`<div class="channel">${newChannel}</div>`)
    })

    // make the channel joined the current channel. Then load the messages.
    // this only fires for the client who made the channel.
    socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel')
        $('.channel-current').removeClass('channel-current')
        $(`.channel:contains('${data.channel}')`).addClass('channel-current')
        $('.channel-current').removeClass('channel')
        $('.message').remove()
        data.messages.forEach((message) => {
            $('.message-container').append(`
                <div class="message">
                    <p class="message-user">${message.sender}: </p>
                    <p class="message-text">${message.message}</p>
                </div>
            `)
        })
    })

    $('#chat-input').bind('keypress', () => {
        socket.emit('typing')
    })

    socket.on('typing', (data) => {
        console.log(`${data.username}`)
        $('.feedback').html('<p><i>' + data.username + ' is typing a message...' + '</i></p>')
    })

    socket.on('user exists', (data) => {
        console.log(`${data}`)
        $('#error-container').html(data)
    })

    $('#sign-out').click( () => {
        console.log('clicked')
        socket.emit('sign out')
        // $('.username-form').css('display', 'flex')
        // $('.main-containter').css('display', 'none')
        $('#username-form').removeClass('is-hidden')
        $('#main-container').addClass('is-hidden')
    })
})