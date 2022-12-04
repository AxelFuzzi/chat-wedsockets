const socket = io.connect();

const agregarProducto = document.getElementById('formAgregarProducto')
agregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: agregarProducto[0].value,
        price: agregarProducto[1].value,
        thumbnail: agregarProducto[2].value
    }
    socket.emit('actualizarProductos', producto);
    agregarProducto.reset()
})

socket.on('verProductos', productos => {
    verProductos(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function verProductos(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const enviarMensaje = document.getElementById('formPublicarMensaje')
enviarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = { autor: inputUsername.value, texto: inputMensaje.value }
    socket.emit('nuevoMensaje', mensaje);
    enviarMensaje.reset()
    inputMensaje.focus()
})

socket.on('verMensajes', mensajes => {
    console.log(mensajes);
    const html = crearLista(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function crearLista(mensajes) {
    return mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor}</b>
                [<span style="color:brown;">${mensaje.fyh}</span>] :
                <i style="color:green;">${mensaje.texto}</i>
            </div>
        `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
