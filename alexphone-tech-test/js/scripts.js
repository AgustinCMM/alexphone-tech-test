document.addEventListener("DOMContentLoaded", function() {
    const botonesAgregar = document.querySelectorAll(".agregar-carrito");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", function(event) {
            event.preventDefault(); // Evita la recarga de la página
            
            const productoId = this.getAttribute("data-id");
            const cantidad = this.getAttribute("data-cantidad") || 1;

            fetch("carrito/agregar_al_carrito.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `producto_id=${productoId}&cantidad=${cantidad}`
            })
            .then(response => response.json())
            .then(data => {
                // Actualiza el contador
                const contadorCarrito = document.getElementById("contador-carrito");
                contadorCarrito.textContent = data.total;

                // Muestra u oculta el contador según la cantidad total de productos
                if (data.total > 0) {
                    contadorCarrito.style.display = 'flex';  // Muestra el contador
                } else {
                    contadorCarrito.style.display = 'none';   // Oculta el contador
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const actualizarCarrito = (data) => {
        document.getElementById("contador-carrito").textContent = data.total;
        document.getElementById("contador-carrito").style.display = data.total > 0 ? "flex" : "none";
    };

    const manejarCambioCarrito = (productoId, accion) => {
        fetch(`carrito/${accion}.php`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `producto_id=${productoId}`
        })
        .then(response => response.json())
        .then(data => {
            actualizarCarrito(data);
            location.reload(); // Recargar para actualizar la lista del carrito
        })
        .catch(error => console.error("Error:", error));
    };

    document.querySelectorAll(".btn-aumentar").forEach(btn => {
        btn.addEventListener("click", () => manejarCambioCarrito(btn.dataset.id, "aumentar"));
    });

    document.querySelectorAll(".btn-disminuir").forEach(btn => {
        btn.addEventListener("click", () => manejarCambioCarrito(btn.dataset.id, "disminuir"));
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => manejarCambioCarrito(btn.dataset.id, "eliminar"));
    });
});

