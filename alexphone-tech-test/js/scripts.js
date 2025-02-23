document.addEventListener("DOMContentLoaded", function () {
    // =================================================================================
    //                               FUNCIONES BASE
    // =================================================================================

    // obtiene el carrito desde localStorage
    function obtenerCarrito() {
        try {
            return JSON.parse(localStorage.getItem("carrito")) || [];
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }

    // actualiza el contador del carrito en el header
    function actualizarCarrito() {
        const carrito = obtenerCarrito();
        const contadorCarrito = document.getElementById("contador-carrito");
        const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadTotal;
            contadorCarrito.style.display = cantidadTotal > 0 ? "flex" : "none";
        }
    }

    // =================================================================================
    //                               FUNCIONES UTILES
    // =================================================================================

    // mapea el color al hex
    function getColorHex(colorName) {
        switch (colorName) {
            case 'white': return '#FAFAF9';
            case 'black': return '#2C2C2E';
            case 'red':   return '#FF3B30';
            case 'pink':  return '#F472B6';
            default:      return '#333';
        }
    }
    // mapea el grade en inglés a español
    function getGradeText(grade) {
        switch (grade) {
            case 'excellent': return 'Excelente';
            case 'very_good': return 'Muy bueno';
            case 'good':      return 'Satisfactorio';
            default:          return grade;
        }
    }
    // mapea el color en inglés a texto en español
    function getColorText(colorName) {
        switch (colorName) {
            case 'white': return 'Blanco';
            case 'black': return 'Negro';
            case 'red':   return 'Rojo';
            case 'pink':  return 'Rosa';
            default:      return colorName; 
        }
    }
    // muestra un mensaje de éxito, se oculta tras 2s
    function mostrarMensajeExito(mensaje) {
        const mensajeExito = document.getElementById("mensaje-exito");
        if (!mensajeExito) return;

        mensajeExito.textContent = mensaje;
        mensajeExito.style.display = "block";
        mensajeExito.classList.remove("oculto");

        setTimeout(() => {
            mensajeExito.classList.add("oculto");
        }, 2000);

        setTimeout(() => {
            mensajeExito.style.display = "none";
        }, 4000);
    }

    // =================================================================================
    //                             FILTROS Y ORDEN
    // =================================================================================

    let productosGlobal = []; // para almacenar productos sin filtrar

    // lee la URL para setear los filtros
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

    // actualiza la URL sin recargar la página
    function actualizarURL() {
        const params = new URLSearchParams(window.location.search);
        const filtroColor = document.getElementById('filtro-color')?.value;
        const filtroCapacidad = document.getElementById('filtro-capacidad')?.value;
        const filtroGrade = document.getElementById('filtro-grade')?.value;
        const ordenPrecio = document.getElementById('orden-precio')?.value;

        filtroColor ? params.set('color', filtroColor) : params.delete('color');
        filtroCapacidad ? params.set('capacity', filtroCapacidad) : params.delete('capacity');
        filtroGrade ? params.set('grade', filtroGrade) : params.delete('grade');
        ordenPrecio ? params.set('orden', ordenPrecio) : params.delete('orden');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    // aplica filtros y orden a productosGlobal, y renderiza
    function aplicarFiltrosYOrden() {
        if (!productosGlobal.length) return;
        const params = new URLSearchParams(window.location.search);
        const color = params.get('color') || '';
        const capacity = params.get('capacity') || '';
        const grade = params.get('grade') || '';
        const orden = params.get('orden') || '';

        let listaFiltrada = productosGlobal.filter(item => {
            if (color && item.color !== color) return false;
            if (capacity && item.storage.toString() !== capacity) return false;
            if (grade && item.grade !== grade) return false;
            return true;
        });

        if (orden === 'asc') {
            listaFiltrada.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (orden === 'desc') {
            listaFiltrada.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        const contenedorProductos = document.getElementById('productos');
        if (!contenedorProductos) return;
        let productosHTML = "";

        listaFiltrada.forEach(producto => {
            const colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;
            const gradeEsp = getGradeText(producto.grade);
            productosHTML += `
                <div class="producto">
                    <a href="detalle.php?sku=${producto.sku}">
                        <img src="${producto.image}" alt="${producto.name}">
                        <h3>${producto.name}</h3>
                    </a>
                    <p>Precio: €${producto.price}</p>
                    <p>Color: ${colorCircle}</p>
                    <p>Capacidad: ${producto.storage}GB</p>
                    <p>Estado: ${gradeEsp}</p>
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

        document.querySelectorAll(".agregar-carrito").forEach(button => {
            button.addEventListener("click", (e) => {
                const { id, sku, name, price, image, color, storage } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
                mostrarMensajeExito("Producto añadido al carrito");
            });
        });
    }

    // asigna eventos a los filtros
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

    // renderiza la lista de productos (index.php)
    function mostrarProductos(productos) {
        productosGlobal = productos;
        if (document.getElementById('filtros')) {
            inicializarFiltrosDesdeURL();
            asignarEventosFiltros();
            aplicarFiltrosYOrden();
        } else {
            // sin filtros
            const contenedorProductos = document.getElementById('productos');
            if (!contenedorProductos) return;

            let productosHTML = "";
            productos.forEach(producto => {
                const colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;
                const gradeEsp = getGradeText(producto.grade);
                productosHTML += `
                    <div class="producto">
                        <a href="detalle.php?sku=${producto.sku}">
                            <img src="${producto.image}" alt="${producto.name}">
                            <h3>${producto.name}</h3>
                        </a>
                        <p>Precio: €${producto.price}</p>
                        <p>Color: ${colorCircle}</p>
                        <p>Capacidad: ${producto.storage}GB</p>
                        <p>Estado: ${gradeEsp}</p>
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

            document.querySelectorAll(".agregar-carrito").forEach(button => {
                button.addEventListener("click", (e) => {
                    const { id, sku, name, price, image, color, storage } = e.target.dataset;
                    agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
                    mostrarMensajeExito("Producto añadido al carrito");
                });
            });
        }
    }

    // =================================================================================
    //                           DETALLE (detalle.php)
    // =================================================================================

    // obtiene la SKU de la URL y hace fetch al endpoint de detalle
    function mostrarDetalle() {
        const params = new URLSearchParams(window.location.search);
        const sku = params.get('sku');
        if (!sku) return;

        fetch(`https://test.alexphone.com/api/v1/sku/${sku}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener detalle: ${response.status}`);
                }
                return response.json();
            })
            .then(producto => {
                renderizarDetalle(producto);
            })
            .catch(err => console.error("Error fetch detalle:", err));
    }

    // mapea la info del producto en 2 columnas (imagen izq, info der)
    function renderizarDetalle(producto) {
        const contenedor = document.getElementById('detalle-producto');
        if (!contenedor) return;

        let colorEsp = getColorText(producto.color);
        let gradeEsp = getGradeText(producto.grade);
        let subtitulo = `${producto.storage} GB / ${colorEsp} / ${gradeEsp}`;
        let colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

        // Cabecera
        contenedor.innerHTML = `
            <div class="detalle-columna detalle-imagen">
                <img src="${producto.image}" alt="${producto.name}">
            </div>
            <div class="detalle-columna detalle-info">
                <div class="detalle-header">
                    <h2>${producto.name}</h2>
                    <p class="price">€${producto.price}</p>
                </div>
                <p class="detalle-subtitulo">${subtitulo}</p>

                <p><strong>Precio:</strong> €${producto.price}</p>
                <p><strong>Color:</strong> ${colorCircle}</p>
                <p><strong>Capacidad:</strong> ${producto.storage}GB</p>
                <p><strong>Estado:</strong> ${gradeEsp}</p>
                <p><strong>Descripción:</strong> ${producto.description}</p>

                <button class="agregar-carrito-detalle"
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

        let btnCarritoDetalle = document.querySelector(".agregar-carrito-detalle");
        if (btnCarritoDetalle) {
            btnCarritoDetalle.addEventListener("click", e => {
                const { id, sku, name, price, image, color, storage } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage);
                mostrarMensajeExito("Producto añadido al carrito");
            });
        }
    }

    // =================================================================================
    //                   RESTO DE FUNCIONES DEL CARRITO
    // =================================================================================

    // agrega un producto al carrito
    function agregarAlCarrito(id, sku, name, price, image, color, storage) {
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({ id, sku, name, price, image, color, storage, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // muestra en carrito.php los productos que hay, con sus cantidades y total
    function mostrarCarrito() {
        const carrito = obtenerCarrito();
        const listaCarrito = document.getElementById("lista-carrito");
        const totalCarrito = document.getElementById("total");
        const mensajeCarrito = document.getElementById("mensaje-carrito");
        const botonComprar = document.getElementById("btn-comprar");
        const contenedorTotal = document.getElementById("total-carrito");

        listaCarrito.innerHTML = "";
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
            let colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;
            let li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <div><img src="${producto.image}" alt="${producto.name}" width="100"></div>
                    <div>
                        <h3>${producto.name}</h3>
                        <p>Precio: <span class="precio">€${producto.price}</span></p>
                        <p>Color: ${colorCircle}</p>
                        <p>Capacidad: ${producto.storage} GB</p>
                    </div>
                </div>
                <div class="buttons">
                    <!-- Aquí multiplicamos directamente price x cantidad -->
                    <span class="precio">€${producto.price * producto.cantidad}</span>
                    <button class="btn-disminuir" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}">-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button class="btn-aumentar" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}">+</button>
                    <button class="btn-eliminar" data-sku="${producto.sku}" data-color="${producto.color}" data-storage="${producto.storage}"></button>
                </div>
            `;
            fragment.appendChild(li);
        });        
        listaCarrito.appendChild(fragment);

        let total = carrito.reduce((acc, producto) => acc + parseFloat(producto.price) * producto.cantidad, 0);
        totalCarrito.textContent = total;

        // eventos aumentar, disminuir, eliminar
        document.querySelectorAll(".btn-aumentar").forEach(button => {
            button.addEventListener("click", e => {
                const { sku, color, storage } = e.target.dataset;
                cambiarCantidad(sku, color, storage, 1);
            });
        });
        document.querySelectorAll(".btn-disminuir").forEach(button => {
            button.addEventListener("click", e => {
                const { sku, color, storage } = e.target.dataset;
                cambiarCantidad(sku, color, storage, -1);
            });
        });
        document.querySelectorAll(".btn-eliminar").forEach(button => {
            button.addEventListener("click", e => {
                const { sku, color, storage } = e.target.dataset;
                eliminarProducto(sku, color, storage);
            });
        });
    }

    // cambia la cantidad de un producto
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

    // elimina un producto del carrito
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
    //                         INICIALIZACIÓN DE LA PÁGINA
    // =================================================================================
    if (document.getElementById("productos")) {
        fetch("https://test.alexphone.com/api/v1/skus")
            .then(response => response.json())
            .then(productos => { mostrarProductos(productos); })
            .catch(error => console.error("Error al obtener productos:", error));
    }
    if (document.getElementById("lista-carrito")) {
        mostrarCarrito();
    }
    if (document.getElementById("detalle-producto")) {
        mostrarDetalle();
    }
    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
});
