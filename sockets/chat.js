module.exports = (io, socket) => {
    // listen for "new user" socket emits
    socket.on('new user', (username) => {
        console.log(`✋ ${username} has joined the chat!`)
        //  send the username to all clients currently connected
        io.emit('new user', username)
    })

    socket.on('new message', (data) => {
        console.log(`🎤 ${data.sender}: ${data.message}`)
        io.emit('new message', data)
    })
}