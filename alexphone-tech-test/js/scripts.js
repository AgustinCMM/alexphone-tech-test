document.addEventListener("DOMContentLoaded", function () {
    // Función para obtener el carrito desde localStorage de manera segura
    function obtenerCarrito() {
        try {
            return JSON.parse(localStorage.getItem("carrito")) || [];
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }

    // Función para actualizar el contador del carrito en el header
    function actualizarCarrito() {
        const carrito = obtenerCarrito();
        const contadorCarrito = document.getElementById("contador-carrito");

        // Sumar todas las cantidades de productos en el carrito
        const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadTotal;
            contadorCarrito.style.display = cantidadTotal > 0 ? "flex" : "none";
        }
    }

    // Función para mostrar los productos en la página principal (index.php)
    function mostrarProductos(productos) {
        const contenedorProductos = document.getElementById("productos");
        let productosHTML = "";

        productos.forEach(producto => {
            productosHTML += `
                <div class="producto">
                    <img src="${producto.image}" alt="${producto.name}">
                    <h3>${producto.name}</h3>
                    <p>Precio: €${producto.price}</p>
                    <p>Color: ${producto.color}</p>
                    <p>Capacidad: ${producto.storage}GB</p>
                    <button class="agregar-carrito" data-id="${producto.id}" data-sku="${producto.sku}" data-name="${producto.name}" data-price="${producto.price}" data-image="${producto.image}" data-color="${producto.color}" data-storage="${producto.storage}">Añadir al carrito</button>
                </div>
            `;
        });

        contenedorProductos.innerHTML = productosHTML;

        // Asignamos el evento a los botones de "Añadir al carrito"
        document.querySelectorAll(".agregar-carrito").forEach(button => {
            button.addEventListener("click", (e) => {
                const { id, sku, name, price, image, color, storage } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
            });
        });
    }

    // Función para agregar un producto al carrito y almacenarlo en localStorage
    function agregarAlCarrito(id, sku, name, price, image, color, storage) {
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito[index].cantidad += 1; // Aumentar la cantidad si ya existe
        } else {
            carrito.push({ id, sku, name, price, image, color, storage, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Función para mostrar el carrito en la página carrito.php
    function mostrarCarrito() {
        const carrito = obtenerCarrito();
        const listaCarrito = document.getElementById("lista-carrito");
        const totalCarrito = document.getElementById("total");
        const mensajeCarrito = document.getElementById("mensaje-carrito");
        const botonComprar = document.getElementById("btn-comprar");
        const contenedorTotal = document.getElementById("total-carrito");

        listaCarrito.innerHTML = ""; // Limpiamos la lista antes de agregar los productos

        if (carrito.length === 0) {
            mensajeCarrito.style.display = "flex";
            listaCarrito.style.display = "none";
            botonComprar.style.display = "none";
            contenedorTotal.style.display = "none";
            return;
        }

        mensajeCarrito.style.display = "none";
        listaCarrito.style.display = "flex";
        botonComprar.style.display = "flex";
        contenedorTotal.style.display = "flex";

        const fragment = document.createDocumentFragment();

        carrito.forEach(producto => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <div><img src="${producto.image}" alt="${producto.name}" width="100"></div>
                    <div>
                        <h3>${producto.name}</h3>
                        <p>Precio: €${producto.price}</p>
                        <p>Color: ${producto.color}</p>
                        <p>Capacidad: ${producto.storage} GB</p>
                        <p>Cantidad: <span class="cantidad">${producto.cantidad}</span></p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn-aumentar" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}">+</button>
                    <button class="btn-disminuir" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}">-</button>
                    <button class="btn-eliminar" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}"></button>
                </div>
            `;
            fragment.appendChild(li);
        });

        listaCarrito.appendChild(fragment);

        // Mostrar el total del carrito
        const total = carrito.reduce((acc, producto) => acc + parseFloat(producto.price) * producto.cantidad, 0);
        totalCarrito.textContent = total;

        // Asignamos eventos a los botones de aumentar, disminuir y eliminar
        document.querySelectorAll(".btn-aumentar").forEach(button => {
            button.addEventListener("click", (e) => {
                const { sku, color, storage } = e.target.dataset;
                cambiarCantidad(sku, color, storage, 1);
            });
        });

        document.querySelectorAll(".btn-disminuir").forEach(button => {
            button.addEventListener("click", (e) => {
                const { sku, color, storage } = e.target.dataset;
                cambiarCantidad(sku, color, storage, -1);
            });
        });

        document.querySelectorAll(".btn-eliminar").forEach(button => {
            button.addEventListener("click", (e) => {
                const { sku, color, storage } = e.target.dataset;
                eliminarProducto(sku, color, storage);
            });
        });
    }

    // Función para cambiar la cantidad de un producto
    function cambiarCantidad(sku, color, storage, cantidad) {
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito[index].cantidad += cantidad;
            if (carrito[index].cantidad <= 0) {
                carrito.splice(index, 1);
            }
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarCarrito();
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(sku, color, storage) {
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito.splice(index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarCarrito();
    }

    // Llamadas a funciones según la página
    if (document.getElementById("productos")) {
        fetch("https://test.alexphone.com/api/v1/skus")
            .then(response => response.json())
            .then(productos => mostrarProductos(productos))
            .catch(error => console.error("Error al obtener productos:", error));
    }

    if (document.getElementById("lista-carrito")) {
        mostrarCarrito();
    }

    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
});
