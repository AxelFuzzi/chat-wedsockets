const { Console } = require('console')
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const Contenedor = require('./clases/Contenedor.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new Contenedor('productos.json')
const mensajesApi = new Contenedor('chat.json')

const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


io.on('connection', async socket => {
    console.log('Cliente conectado');

    socket.emit('verProductos', await productosApi.getAll());

    socket.on('actualizarProductos', async producto => {
       await  productosApi.addProduct(producto)
        console.log(productosApi.getAll())
        io.sockets.emit('verProductos', await productosApi.getAll());
    })

    socket.emit('verMensajes', await mensajesApi.getAll());

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.addProduct(mensaje)
        io.sockets.emit('verMensajes', await mensajesApi.getAll());
    })
});

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Running in http://localHost:${PORT}`)
})
connectedServer.on('error', error => console.log(`Error: ${error}`))
