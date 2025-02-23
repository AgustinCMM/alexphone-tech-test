document.addEventListener("DOMContentLoaded", function () {
    // =================================================================================
    //                          FUNCIONES BASE
    // =================================================================================

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

    // =================================================================================
    //                   NUEVA FUNCIÓN PARA OBTENER HEX DE UN COLOR
    // =================================================================================
    /**
     * Devuelve el código HEX correspondiente a cada color del API.
     */
    function getColorHex(colorName) {
        switch (colorName) {
            case 'white': return '#FAFAF9';
            case 'black': return '#2C2C2E';
            case 'red':   return '#FF3B30';
            case 'pink':  return '#F472B6';
            default:      return '#333'; // fallback
        }
    }

    // =================================================================================
    //                          FUNCIONES PARA FILTROS
    // =================================================================================

    // Variable global para almacenar todos los productos sin filtrar
    let productosGlobal = [];

    // Inicializa los filtros con lo que haya en la URL (si existe)
    function inicializarFiltrosDesdeURL() {
        const params = new URLSearchParams(window.location.search);

        const filtroColor = document.getElementById('filtro-color');
        const filtroCapacidad = document.getElementById('filtro-capacidad');
        const filtroGrade = document.getElementById('filtro-grade');
        const ordenPrecio = document.getElementById('orden-precio');

        if (filtroColor) filtroColor.value = params.get('color') || '';
        if (filtroCapacidad) filtroCapacidad.value = params.get('capacity') || '';
        if (filtroGrade) filtroGrade.value = params.get('grade') || '';
        if (ordenPrecio) ordenPrecio.value = params.get('orden') || '';
    }

    // Actualiza la URL según los selects para poder compartir el enlace
    function actualizarURL() {
        const params = new URLSearchParams(window.location.search);

        const filtroColor = document.getElementById('filtro-color')?.value;
        const filtroCapacidad = document.getElementById('filtro-capacidad')?.value;
        const filtroGrade = document.getElementById('filtro-grade')?.value;
        const ordenPrecio = document.getElementById('orden-precio')?.value;

        // Ajustar los params dependiendo si están vacíos o no
        filtroColor ? params.set('color', filtroColor) : params.delete('color');
        filtroCapacidad ? params.set('capacity', filtroCapacidad) : params.delete('capacity');
        filtroGrade ? params.set('grade', filtroGrade) : params.delete('grade');
        ordenPrecio ? params.set('orden', ordenPrecio) : params.delete('orden');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    // Aplica los filtros y orden a la lista en productosGlobal
    function aplicarFiltrosYOrden() {
        if (!productosGlobal.length) return;

        const params = new URLSearchParams(window.location.search);
        const color = params.get('color') || '';
        const capacity = params.get('capacity') || '';
        const grade = params.get('grade') || '';
        const orden = params.get('orden') || '';

        // Filtrar
        let listaFiltrada = productosGlobal.filter(item => {
            if (color && item.color !== color) return false;
            if (capacity && item.storage.toString() !== capacity) return false;
            if (grade && item.grade !== grade) return false;
            return true;
        });

        // Ordenar
        if (orden === 'asc') {
            listaFiltrada.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (orden === 'desc') {
            listaFiltrada.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        // Renderizar la lista filtrada
        const contenedorProductos = document.getElementById('productos');
        if (!contenedorProductos) return;

        let productosHTML = "";
        listaFiltrada.forEach(producto => {
            // Insertamos un span con clase "color-circle" y el background en base a getColorHex()
            const colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

            productosHTML += `
                <div class="producto">
                    <img src="${producto.image}" alt="${producto.name}">
                    <h3>${producto.name}</h3>
                    <p>Precio: €${producto.price}</p>
                    <p>Color: ${colorCircle}</p>
                    <p>Capacidad: ${producto.storage}GB</p>
                    <button class="agregar-carrito"
                            data-id="${producto.id}"
                            data-sku="${producto.sku}"
                            data-name="${producto.name}"
                            data-price="${producto.price}"
                            data-image="${producto.image}"
                            data-color="${producto.color}"
                            data-storage="${producto.storage}">
                        Añadir al carrito
                    </button>
                </div>
            `;
        });

        contenedorProductos.innerHTML = productosHTML;

        // Reasignar eventos para añadir al carrito
        document.querySelectorAll(".agregar-carrito").forEach(button => {
            button.addEventListener("click", (e) => {
                const { id, sku, name, price, image, color, storage } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
            });
        });
    }

    // Asigna eventos a los selects de filtro, para actualizar la URL y re-filtrar al cambiar
    function asignarEventosFiltros() {
        const filtroColor = document.getElementById('filtro-color');
        const filtroCapacidad = document.getElementById('filtro-capacidad');
        const filtroGrade = document.getElementById('filtro-grade');
        const ordenPrecio = document.getElementById('orden-precio');

        if (!filtroColor || !filtroCapacidad || !filtroGrade || !ordenPrecio) return;

        [filtroColor, filtroCapacidad, filtroGrade, ordenPrecio].forEach(el => {
            el.addEventListener('change', () => {
                actualizarURL();
                aplicarFiltrosYOrden();
            });
        });
    }

    // =================================================================================
    //                            FUNCIÓN MOSTRARPRODUCTOS
    // =================================================================================
    function mostrarProductos(productos) {
        // Guardamos la lista en productosGlobal para poder filtrar
        productosGlobal = productos;

        // Verificamos si existe la sección de filtros
        if (document.getElementById('filtros')) {
            inicializarFiltrosDesdeURL();
            asignarEventosFiltros();
            aplicarFiltrosYOrden();
        } else {
            // Si, por alguna razón, no existe la sección de filtros, renderizamos normal
            const contenedorProductos = document.getElementById('productos');
            if (!contenedorProductos) return;

            let productosHTML = "";
            productos.forEach(producto => {
                const colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

                productosHTML += `
                    <div class="producto">
                        <img src="${producto.image}" alt="${producto.name}">
                        <h3>${producto.name}</h3>
                        <p>Precio: €${producto.price}</p>
                        <p>Color: ${colorCircle}</p>
                        <p>Capacidad: ${producto.storage}GB</p>
                        <button class="agregar-carrito"
                                data-id="${producto.id}"
                                data-sku="${producto.sku}"
                                data-name="${producto.name}"
                                data-price="${producto.price}"
                                data-image="${producto.image}"
                                data-color="${producto.color}"
                                data-storage="${producto.storage}">
                            Añadir al carrito
                        </button>
                    </div>
                `;
            });
            contenedorProductos.innerHTML = productosHTML;

            // Reasignar eventos para añadir al carrito
            document.querySelectorAll(".agregar-carrito").forEach(button => {
                button.addEventListener("click", (e) => {
                    const { id, sku, name, price, image, color, storage } = e.target.dataset;
                    agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
                });
            });
        }
    }

    // =================================================================================
    //                         RESTO DE FUNCIONES DEL CARRITO
    // =================================================================================

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
            // Insertamos el colorCircle con el background de getColorHex
            const colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <div><img src="${producto.image}" alt="${producto.name}" width="100"></div>
                    <div>
                        <h3>${producto.name}</h3>
                        <p>Precio: €${producto.price}</p>
                        <p>Color: ${colorCircle}</p>
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

    // =================================================================================
    //                         INICIALIZACIÓN AL CARGAR LA PÁGINA
    // =================================================================================
    // Llamadas a funciones según la página
    if (document.getElementById("productos")) {
        fetch("https://test.alexphone.com/api/v1/skus")
            .then(response => response.json())
            .then(productos => {
                mostrarProductos(productos);
            })
            .catch(error => console.error("Error al obtener productos:", error));
    }

    if (document.getElementById("lista-carrito")) {
        mostrarCarrito();
    }

    // Actualizamos el contador del carrito en todas las páginas
    actualizarCarrito();

    // Escuchar cambios en localStorage (si abren otra pestaña, etc.)
    window.addEventListener("storage", actualizarCarrito);
});
