$(document).ready( () => {
    // connect to the sockt.io Server
    const socket = io.connect()

    $('#create-user-btn').click((e) => {
        e.preventDefault()
        let username = $('#username-input').val()
        if (username.length > 0) {
            // emit to the server the new user 
            socket.emit('new user', username)
            $('.username-form').remove()
            $('.main-containter').css('display', 'flex')
        }
    })

    $('#send-chat-btn').click((e) => {
        e.preventDefault()
        let msg = $(`#chat-input`).val()
        if (msg.length > 0) {
            socket.emit('new message', {
                sender: currentUser,
                message: msg,
            })
            $('#chat-input').val("")
        }
    })

    // socket listerners
    socket.on('new user', (username) =>{
        console.log(`✋ ${username} has joined the chat!`)
        // add the new user to the online users div
        $('.users-online').append(`div class="user-online">${username}</div>`)
    })

    socket.on('new message', (data) => {
        $('.message-container').append(`
            <div class="message">
                <p class="message-user">${data.sender}: </p>
                <p class="message-text>${data.msg}</p>
            </div>
        `)
    })
})