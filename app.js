const LIGHTNING_CHARGE_TOKEN = 'mySecretToken123'
const DEFAULT_PRICE_BTC = 0.01

const FILES_DIR = 'for-sale' // Directory your files will be served from

const morgan = require('morgan')
const pay = require('paypercall')({ chargeToken: LIGHTNING_CHARGE_TOKEN, currency: 'BTC', chargeUrl: 'http://192.168.1.94:9112' })
    , express = require('express')
    , fs = require('fs')
    , path = require('path')
    , WebSocket = require('ws')
    , serveIndex = require('serve-index')

var app = express()

app.use(require('body-parser').urlencoded({extended: true}))
app.use(morgan('combined'))

var router = express.Router()

// Set up dynamic pricing
// (Currently must add other dirs to the path by hand; only flat structure works automatically)
// Example: router.get(['/buy/:fileName', '/buy/myFolder/:fileName'], ...
app.get('/buy/:fileName', (req, res, next) => {
  //return res.send({test: 'test'})
  //console.log(next)
  //console.log(req.invoice)
  //console.log(res)
  // Skip dirs
  if (!req.params.fileName.includes('.')) { return next() }
  pay(getPriceForFile(req.params.fileName))(req, res, next => {
    console.log(next)
    console.log(req.invoice)
    console.log(res)

    // Payment successful; present download
    return res.download(path.join(__dirname, FILES_DIR, req.params.fileName))
  })
})

/*
const ws = new WebSocket('http://api-token:mySecretToken123@127.0.0.1:9112/ws')

ws.addEventListener('message', msg => {
  const inv = JSON.parse(msg.data)
  console.log('Paid invoice:', inv)
})
*/

function getPriceForFile(fileName) {
    // TODO price lookup mechanism
    return DEFAULT_PRICE_BTC
}

app.use(router)

// Serve files
// TODO middleware only applies to base route right now ('/buy')
// (This could be extended with express-enrouten)
app.use('/buy', express.static(FILES_DIR), serveIndex(FILES_DIR, {'icons': true, 'hidden': true}))

//app.use(function (err, req, res, next) { return res.status(400).send(err.toString()) });

//app.listen(app.settings.port, app.settings.host, _ =>
  //console.log(`Running on http://${ app.settings.host }:${ app.settings.port }`))

const port = 8000
app.listen(port)
console.log('Listening on port ${ port }...')
