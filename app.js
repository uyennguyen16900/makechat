const express = require('express')
const app = express()
// socket.iohas to use the http server 
const server = require('http').Server(app)

// Express View Engine for Handlebars
const exphbs = require('express-hnadlebars')
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index.handlebars')
})

server.listen('3000', () => {
    console.log('Server lisening on Port 3000')
})