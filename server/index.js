const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server)
const MarginService = require('./service/margins2')(io)

const { groupByVolume, groupByExchange } = require('./service/helpers')

// app.get('/', app.use(express.static('dist')))
app.get('/', app.use(express.static('src')))

app.get('/api/stats', (req, res) => {
  return res.send(MarginService.getState())
})

app.get('/api/margins', (req, res) => {
  return res.send(MarginService.getState('margins').sort((a, b) => b.netMargin - a.netMargin))
})

app.get('/api/margins/lite', (req, res) => {
  return res.send(
    MarginService.getState('margins')
      .reduce(
        (acc, margin) => [
          ...acc,
          {
            buy: margin.buy.name,
            sell: margin.sell.name,
            vol: margin.volume,
            netMargin: margin.netMargin,
            netDifference: margin.netDifference
          }
        ],
        []
      )
      .sort((a, b) => b.netMargin - a.netMargin)
  )
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
