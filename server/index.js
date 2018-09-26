const express = require('express')

const app = express()
var expressWs = require('express-ws')(app)

app.get('/', (req, res) => {
  res.send({ express: 'Hello From Express' })
})

app.ws('/', function(ws, req) {
  // ws.on('message', function(msg) {
  //   ws.send(msg)
  // })
  let counter = 0

  setInterval(function() {
    if (counter === 10) {
      ws.send('Thanks! No more, ' + counter)
      clearInterval(this)
    } else {
      console.log('sending', counter)
      ws.send(counter++)
    }
  }, 500)
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
