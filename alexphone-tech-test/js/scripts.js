document.addEventListener("DOMContentLoaded", function () {
    // =================================================================================
    //                               FUNCIONES BASE
    // =================================================================================
    // obtiene el carrito desde localStorage
    function obtenerCarrito() {
        // Convertir en objeto lo que hay en localStorage, 
        // si algo falla, retorno un arreglo vacío.
        try {
            return JSON.parse(localStorage.getItem("carrito")) || [];
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }
    // Actualiza el contador del carrito en el header
    function actualizarCarrito() {
        // Recupero el carrito y sumo la cantidad de cada producto
        const carrito = obtenerCarrito();
        const contadorCarrito = document.getElementById("contador-carrito");
        const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        // Muestro el número de productos si hay, o lo oculto si está en 0
        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadTotal;
            contadorCarrito.style.display = cantidadTotal > 0 ? "flex" : "none";
        }
    }

    // =================================================================================
    //                               FUNCIONES UTILES
    // =================================================================================
    // mapea el color a hexadecimal (sólo para mostrarlo en pantalla)
    function getColorHex(colorName) {
        // Devuelvo el código de color en hexadecimal para mostrar un círculo de color.
        switch (colorName) {
            case 'white': return '#FAFAF9';
            case 'black': return '#2C2C2E';
            case 'red':   return '#FF3B30';
            case 'pink':  return '#F472B6';
            default:      return '#333';
        }
    }
    // mapea el estado en inglés a español (sólo para mostrarlo en pantalla)
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
        // Extraigo los parámetros y seteo los valores iniciales de los selects, 
        // si es que vienen en la URL.
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
        // Primero aplico los filtros y luego el orden, y después muestro.
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
            // Mostrar color y grade en pantalla con funciones de “traducción” 
            // Guardamos los valores originales en data-*
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
        // Al cambiar los selects, actualizo la URL y vuelvo a filtrar.
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
        // Guardo los productos para filtrar con ellos.
        productosGlobal = productos;

        // Si existe el contenedor de filtros, inicializamos y aplicamos
        if (document.getElementById('filtros')) {
            inicializarFiltrosDesdeURL();
            asignarEventosFiltros();
            aplicarFiltrosYOrden();
        } else {
            // Si no hay filtros, sólo renderizamos
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
        // Obtengo la SKU desde los parámetros de la URL 
        // y solicito al endpoint la info detallada de ese producto.
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
        // Mostrar en pantalla toda la información de un producto específico.
        const contenedor = document.getElementById('detalle-producto');
        if (!contenedor) return;

        // Convierto el color y el grade para mostrar
        let colorEsp = getColorText(producto.color);
        let gradeEsp = getGradeText(producto.grade);
        let subtitulo = `${producto.storage} GB / ${colorEsp} / ${gradeEsp}`;
        let colorCircle = `<span class="color-circle" style="background-color: ${getColorHex(producto.color)};"></span>`;

        // Genero el HTML con la imagen, el nombre, el precio, etc.
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

        // Añadir el producto al carrito cuando se hace clic
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
    //                       RESTO DE FUNCIONES DEL CARRITO
    // =================================================================================

    function agregarAlCarrito(id, sku, name, price, image, color, storage, grade) {
        // Compruebo si el producto ya existe en el carrito y, si sí, 
        // incremento la cantidad; si no, lo agrego desde 0.
        const carrito = obtenerCarrito();
        const index = carrito.findIndex(item => item.sku === sku && item.color === color && item.storage === storage);

        if (index !== -1) {
            carrito[index].cantidad += 1;
        } else {
            // Se guardan los valores originales
            carrito.push({ id, sku, name, price, image, color, storage, grade, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    function mostrarCarrito() {
        // Obtengo el carrito y muestro cada producto en pantalla
        const carrito = obtenerCarrito();
        const listaCarrito = document.getElementById("lista-carrito");
        const totalCarrito = document.getElementById("total");
        const mensajeCarrito = document.getElementById("mensaje-carrito");
        const botonComprar = document.getElementById("btn-comprar");
        const contenedorTotal = document.getElementById("total-carrito");

        listaCarrito.innerHTML = "";
        if (carrito.length === 0) {
            // Si el carrito está vacío, muestro un mensaje indicando eso.
            mensajeCarrito.style.display = "flex";
            listaCarrito.style.display = "none";
            botonComprar.style.display = "none";
            contenedorTotal.style.display = "none";
            return;
        }
        // Caso contrario, muestro la lista y un botón para ir a Checkout.
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

        // Calculo el total general
        let total = carrito.reduce((acc, producto) => acc + parseFloat(producto.price) * producto.cantidad, 0);
        totalCarrito.textContent = total;

        // Botones para aumentar, disminuir o eliminar
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

        // Redirigir a checkout.php
        if (botonComprar) {
            botonComprar.removeEventListener("click", goCheckout);
            botonComprar.addEventListener("click", goCheckout);
        }
    }

    // Redirige a checkout.php
    function goCheckout() {
        window.location.href = "checkout.php";
    }

    function cambiarCantidad(sku, color, storage, cantidad) {
        // Ajusto la cantidad (sumo o resto) y si llega a 0, quito el producto.
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
        // Elimino por completo un producto del carrito.
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
        // Enviar la orden al servidor.
        const carrito = obtenerCarrito();
        const resultadoDiv = document.getElementById("checkout-resultado");
    
        if (!carrito.length) {
            // Si no hay productos, muestro un mensaje y lo indico en consola.
            if (resultadoDiv) {
                resultadoDiv.innerHTML = "<p>No hay productos enviados desde el carrito.</p>";
            }
            console.log("No hay productos enviados desde el carrito.");
            return;
        }
    
        // Construir el body que será enviado
        const skusParaEnviar = carrito.map(item => ({
            id: item.id,
            sku: item.sku,
            grade: item.grade,
            color: item.color,
            storage: Number(item.storage),
        }));
    
        const body = { skus: skusParaEnviar };
        
        // Mostrar en consola y en pantalla lo que se envía
        const bodyString = JSON.stringify(body, null, 2);  // formateado con 2 espacios
        
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
            // Éxito: vaciar carrito, mostrar en pantalla y en consola
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
            // Si algo falla, muestro el error en consola y en pantalla
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

    // Aquí determino en qué página estoy y ejecuto la lógica que corresponda.
    if (document.getElementById("productos")) {
        // Si existe #productos, estoy en index.php
        // Solicito la lista de SKUs para mostrarlos.
        fetch("https://test.alexphone.com/api/v1/skus")
            .then(response => response.json())
            .then(productos => { mostrarProductos(productos); })
            .catch(error => console.error("Error al obtener productos:", error));
    }

    if (document.getElementById("lista-carrito")) {
        // Si existe #lista-carrito, estoy en carrito.php
        // Muestro el contenido del carrito.
        mostrarCarrito();
    }

    if (document.getElementById("detalle-producto")) {
        // Si estoy en detalle.php, llamo a mostrarDetalle para
        // pedir la info de un único producto.
        mostrarDetalle();
    }

    // Si estoy en checkout.php, se dispara realizarCheckout
    if (document.getElementById("checkout")) {
        // Llamo a la función de checkout para confirmar la compra
        realizarCheckout();
    }

    // Actualizo el contador del carrito y escucho cambios de storage
    actualizarCarrito();
    window.addEventListener("storage", actualizarCarrito);
});
