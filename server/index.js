const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server)
const MarginService = require('./service/margins')(io)

app.get('/', app.use(express.static('dist')))

app.get('/stats', (req, res) => {
  return res.send(MarginService.getState())
})

io.on('connection', function(socket) {
  socket.send(MarginService.getState())

  socket.on('message', function(message) {
    switch (message) {
      case 'RESET':
        return socket.send(MarginService.forceUpdate())
      default:
        return
    }
  })
})

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Listening on port ${port}`))
