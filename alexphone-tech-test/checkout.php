<!DOCTYPE html>
<html lang="es">
<head>
    <?php
    $url_entorno = ''; // Ruta base para las URLs del entorno.
    $page_title = 'Confirmación de compra'; // Título de la página.
    require $url_entorno . 'partials/head.php'; // Incluye la cabecera.
    ?>
</head>
<body>
    <?php require $url_entorno . 'partials/header.php'; // Barra de navegación ?>

    <!-- Mensaje de éxito cuando se añaden productos al carrito -->
    <div id="mensaje-exito" class="mensaje-exito" style="display: none;"></div>

    <main id="checkout">
        <h1>Confirmación de Pedido</h1>

        <section id="checkout-resultado">
            <!-- scripts.js => realizarCheckout() => muestra validación aquí -->
            <p>Procesando tu pedido...</p>
        </section>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; // Pie de página ?>
</body>
</html>
