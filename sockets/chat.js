module.exports = (io, socket, onlineUsers, channels) => {
    // listen for "new user" socket emits
    socket.on('new user', (username) => {
        //Save the username as key to access the user's socket id
        onlineUsers[username] = socket.id
        //Save the username to socket as well. This is important for later.
        socket["username"] = username
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username)
    })

    socket.on('new message', (data) => {
        console.log(`🎤 ${data.sender}: ${data.message}`)
        channels[data.channel].push({sender: data.sender, message: data.message})
        // emit only to sockets that are in the channel room
        io.to(data.channel).emit('new message', data)
    })

    socket.on('get online users', () => {
        // send over the onlineUsers
        socket.emit('get online users', onlineUsers)
    })

    socket.on('disconnect', () => {
        // this deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers)
    })

    socket.on('new channel', (newChannel) => {
        console.log(newChannel)
    })

    socket.on('new channel', (newChannel) => {
        //Save the new channel to our channels object. The array will hold the messages.
        channels[newChannel] = []
        //Have the socket join the new channel room.
        socket.join(newChannel)
        //Inform all clients of the new channel.
        io.emit('new channel', newChannel)
        //Emit to the client that made the new channel, to change their channel to the one they made.
        socket.emit('user changed channel', {
          channel : newChannel,
          messages : channels[newChannel]
        })
    })
}