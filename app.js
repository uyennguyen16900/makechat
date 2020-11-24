const express = require('express')
const app = express()
// socket.iohas to use the http server 
const server = require('http').Server(app)

// Express View Engine for Handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({defaultLayout: null}))
app.set('view engine', 'handlebars')
// establish your public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.render('index.handlebars')
})

const io = require('socket.io')(server)
let onlineUsers = {}
let channels = {"General": []}
io.on("connection", (socket) => {
    // this file will be read on new socket connections
    require('./sockets/chat.js')(io, socket, onlineUsers, channels)
})

server.listen('3000', () => {
    console.log('Server lisening on Port 3000')
})