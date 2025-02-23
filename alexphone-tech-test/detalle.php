<!DOCTYPE html>
<html lang="es">
<head>
    <?php
    $url_entorno = ''; // Ruta base para las URLs del entorno.
    $page_title = 'Detalle del iPhone - AlexPhone'; // Título de la página.
    require $url_entorno . 'partials/head.php'; // Incluye la cabecera.
    ?>
</head>
<body>
    <?php require $url_entorno . 'partials/header.php'; // Incluye el header con el logo y el carrito. ?>

    <!-- Mensaje de éxito para cuando se añade al carrito -->
    <div id="mensaje-exito" class="mensaje-exito" style="display: none;"></div>

    <main id="detalle">
        <h1>Detalle del Producto</h1>
        <section id="detalle-producto">
            <!-- Se llenará dinámicamente con scripts.js => mostrarDetalle() => renderizarDetalle() -->
        </section>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; ?>
</body>
</html>
