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

    // mapea el color al hex (sólo para mostrarlo en pantalla)
    function getColorHex(colorName) {
        switch (colorName) {
            case 'white': return '#FAFAF9';
            case 'black': return '#2C2C2E';
            case 'red':   return '#FF3B30';
            case 'pink':  return '#F472B6';
            default:      return '#333';
        }
    }

    // mapea el grade en inglés a español (sólo para mostrarlo en pantalla)
    function getGradeText(grade) {
        switch (grade) {
            case 'excellent': return 'Excelente';
            case 'very_good': return 'Muy bueno';
            case 'good':      return 'Satisfactorio';
            default:          return grade;
        }
    }

    // mapea el color en inglés a texto en español (sólo para mostrarlo en pantalla)
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
    //                             FILTROS Y ORDEN (INDEX)
    // =================================================================================

    let productosGlobal = []; // Almacena todos los productos sin filtrar

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

    // Aplica filtros y orden a productosGlobal, y renderiza
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
            // Mostramos color y grade en pantalla con funciones de “traducción,” 
            // pero guardamos los valores originales en data-*
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
                        data-storage="${producto.storage}"
                        data-grade="${producto.grade}">
                        Añadir al carrito
                    </button>
                </div>
            `;
        });

        contenedorProductos.innerHTML = productosHTML;

        document.querySelectorAll(".agregar-carrito").forEach(button => {
            button.addEventListener("click", (e) => {
                const { id, sku, name, price, image, color, storage, grade } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage, grade);
                mostrarMensajeExito("Producto añadido al carrito");
            });
        });
    }

    // Asigna eventos a los selects de filtros
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

    // Renderiza la lista de productos en index.php
    function mostrarProductos(productos) {
        productosGlobal = productos;

        // Si existe el contenedor de filtros => inicializamos y aplicamos
        if (document.getElementById('filtros')) {
            inicializarFiltrosDesdeURL();
            asignarEventosFiltros();
            aplicarFiltrosYOrden();
        } else {
            // Sin filtros, sólo renderizamos
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
                            data-storage="${producto.storage}"
                            data-grade="${producto.grade}">
                            Añadir al carrito
                        </button>
                    </div>
                `;
            });

            contenedorProductos.innerHTML = productosHTML;

            document.querySelectorAll(".agregar-carrito").forEach(button => {
                button.addEventListener("click", (e) => {
                    const { id, sku, name, price, image, color, storage, grade } = e.target.dataset;
                    agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage, grade);
                    mostrarMensajeExito("Producto añadido al carrito");
                });
            });
        }
    }

    // =================================================================================
    //                           DETALLE (detalle.php)
    // =================================================================================

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

    function renderizarDetalle(producto) {
        const contenedor = document.getElementById('detalle-producto');
        if (!contenedor) return;

        let colorEsp = getColorText(producto.color);
        let gradeEsp = getGradeText(producto.grade);
        let subtitulo = `${producto.storage} GB / ${colorEsp} / ${gradeEsp}`;
        let colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

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
                    data-storage="${producto.storage}"
                    data-grade="${producto.grade}">
                    Añadir al carrito
                </button>
            </div>
        `;

        let btnCarritoDetalle = document.querySelector(".agregar-carrito-detalle");
        if (btnCarritoDetalle) {
            btnCarritoDetalle.addEventListener("click", e => {
                const { id, sku, name, price, image, color, storage, grade } = e.target.dataset;
                agregarAlCarrito(id, sku, name, parseFloat(price), image, color, storage, grade);
                mostrarMensajeExito("Producto añadido al carrito");
            });
        }
    }

    // =================================================================================
    //                   RESTO DE FUNCIONES DEL CARRITO
    // =================================================================================

    function agregarAlCarrito(id, sku, name, price, image, color, storage, grade) {
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito[index].cantidad += 1;
        } else {
            // Se guardan los valores originales (incluyendo grade)
            carrito.push({ id, sku, name, price, image, color, storage, grade, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

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
                    <!-- total = price * cantidad -->
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

        // Botones para cambiar cantidades/eliminar
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

        // En vez de confirmar la compra aquí, redirigimos a checkout.php
        if (botonComprar) {
            botonComprar.removeEventListener("click", goCheckout);
            botonComprar.addEventListener("click", goCheckout);
        }
    }

    // Simplemente redirige a checkout.php
    function goCheckout() {
        window.location.href = "checkout.php";
    }

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
    //                     LÓGICA DE CONFIRMACIÓN EN checkout.php
    // =================================================================================

    function realizarCheckout() {
        const carrito = obtenerCarrito();
        const resultadoDiv = document.getElementById("checkout-resultado");
    
        if (!carrito.length) {
            if (resultadoDiv) {
                resultadoDiv.innerHTML = "<p>No hay productos enviados desde el carrito.</p>";
            }
            console.log("No hay productos enviados desde el carrito.");
            return;
        }
    
        // Construimos el body EXACTO que será enviado
        const skusParaEnviar = carrito.map(item => ({
            id: item.id,
            sku: item.sku,
            grade: item.grade,
            color: item.color,
            storage: Number(item.storage),
        }));
    
        const body = { skus: skusParaEnviar };
        
        // Para mostrar en consola y pantalla lo que se envía
        const bodyString = JSON.stringify(body, null, 2);  // formateado con 2 espacios
        
        // (Opcional) Lo mostramos en consola antes de hacer el fetch
        console.log("Enviando al servidor:", bodyString);
    
        // PUT a la API
        fetch("https://test.alexphone.com/api/v1/order", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: bodyString
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`Error en la confirmación (status ${resp.status})`);
            }
            return resp.text(); 
        })
        .then(textoRespuesta => {
            // Éxito: vaciar carrito, mostrar en pantalla
            localStorage.removeItem("carrito");
            actualizarCarrito();
    
            console.log("Confirmación exitosa:", textoRespuesta);
            
            if (resultadoDiv) {
                resultadoDiv.innerHTML = `
                    <p>¡Pedido confirmado con éxito!</p>
                    <p>Mensaje enviado al servidor:</p>
                    <pre>${bodyString}</pre>
                    <br/>
                    <p>Respuesta del servidor:</p>
                    <pre>${textoRespuesta || "(Sin contenido en la respuesta)"}</pre>
                `;
            }
        })
        .catch(err => {
            console.error("Error confirmando pedido:", err);
            if (resultadoDiv) {
                resultadoDiv.innerHTML = `
                    <p style="color:red;">Hubo un problema al confirmar tu pedido.</p>
                    <p>Detalle: ${err.message}</p>
                `;
            }
        });
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

    // Si estamos en checkout.php => se dispara realizarCheckout
    if (document.getElementById("checkout")) {
        realizarCheckout();
    }

    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
});
