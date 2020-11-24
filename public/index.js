$(document).ready( () => {
    // connect to the sockt.io Server
    const socker = io.connect()

    $('creat-user-btn').click((e) => {
        e.preventDefault()
        let username = $('#username-input').val()
        if (username.length > 0) {
            // emit to the server the new user 
            socket.emit('new user', username)
            $('.username-form').remove()
        }
    })

    // socket listerners
    socket.on('new user', (username) =>{
        console.log(`✋ ${username} has joined the chat!`)
    })
})