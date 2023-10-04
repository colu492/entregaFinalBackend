
// Conexión al servidor de Socket.io
const socketClient = io();

// Manejo del evento de envío de formulario para agregar un producto
const addform = document.querySelector("#addproduct");
addform.addEventListener("submit", (ev) => {
    ev.preventDefault();

    // Obtener datos del formulario
    const formData = new FormData(addform);
    const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        thumbnails: formData.get("thumbnails"),
        status: formData.get("status"),
        code: formData.get("code"),
        stock: parseInt(formData.get("stock")),
    }

    // Emitir evento al servidor para agregar un producto
    console.log('Evento "submit" del formulario de agregar producto con datos:', productData); 
    socketClient.emit("addProd", productData);
});

// Manejo del evento de clic en un botón para borrar un producto
document.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("deleteproduct")) {
        ev.preventDefault();
        const prodid = ev.target.getAttribute("prodid");

        // Emitir evento al servidor para borrar un producto
        console.log('Botón "Borrar producto" con ID:', prodid);
        socketClient.emit("deleteProd", prodid);
    }
});

// Manejo del evento de recepción de la lista de productos desde el servidor
socketClient.on("products", (productos) => {
    let innerHtml = "";

    // Actualizar la interfaz con la lista de productos
    productos.forEach((producto) => {
        innerHtml += `
        <div id="product${producto.id}">
        <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <p>Categoría: ${producto.category}</p>
            <p>Imagen: ${producto.thumbnails}</p>
            <p>Status: ${producto.status}</p>
            <p>Código: ${producto.code}</p>
            <p>Stock: ${producto.stock}</p>
            <input
                type="button"
                class="deleteproduct"
                prodid="${producto.id}"
                value="Borrar este producto"
            />
            </div>
            `;
    });
    // Mostrar productos en tiempo real en la interfaz
    console.log('Productos recibidos:', productos);
    document.querySelector("#realtimeproducts").innerHTML = innerHtml;    
});

// Manejo del evento de recepción de errores desde el servidor
socketClient.on("error", (errores) => {
    console.log('Evento "error" recibido con errores:', errores);
    // Mostrar errores en una alerta
    let errorestxt = "ERROR\r";
    errores.errortxt.forEach((error) => {
        errorestxt += error + "\r";
    });
    alert(errorestxt);
});
// Manejo del evento de recepción de resultados desde el servidor
socketClient.on("result", (resultado) => {
    console.log('Evento "result" recibido con resultado:', resultado);
    alert(resultado);
});