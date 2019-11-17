const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const socketio = require('socket.io')
const http = require('http')

const routes = require('./routes')

const app = express() // exportar app em caso de não usar socket.io
const server = http.Server(app)
const io = socketio(server)

mongoose.connect('mongodb://username:password@host:port/database?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const connectedUsers = {}

io.on('connection', socket => {
  console.log(socket.handshake.query)
  console.log('usuario conectado', socket.id)
  // socket.emit('hello', 'World')

  const { user_id } = socket.handshake.query

  connectedUsers[user_id] = socket.id
})

app.use((req, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  return next()
})

// app.use(cors({ origin: 'http://localhost:3333' })) // configura origem
app.use(cors()) // qualquer app acessa origem
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

// GET, POST, PUT, DELETE

// req.query -> Acessar query params (para filtros - GET)
// req.params -> Acessar route params (para edição e delete - PUT e DELETE)
// req.body -> Acessar corpo da requisição (para criação e edição - POST e PUT)

// app.get('/users', (req, res) => {
//   return res.json({ idade: req.query.idade })
// })

// app.post('/users', (req, res) => {
//   return res.json(req.body)
// })

// app.put('/users/:id', (req, res) => {
//   return res.json({ id: req.params.id })
// })

server.listen(3333)