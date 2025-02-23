<!DOCTYPE html>
<html lang="es">
<head>
    <?php
    $url_entorno = ''; // Ruta base para las URLs del entorno.
    $page_title = 'Carrito de compras'; // Título de la página.
    require $url_entorno . 'partials/head.php'; // Incluye la cabecera.
    ?>
</head>
<body>
    <?php require $url_entorno . 'partials/header.php'; // Incluye el header con el logo y el carrito. ?>

    <main id="carrito">
        <h1>Carrito de compras</h1>

        <div id="mensaje-carrito">
            <!-- Mensaje de carrito vacío -->
            <p>Ops, tu cesta aún está vacía</p>
            <a href="<?php echo $url_entorno; ?>index.php">
                <button id="btn-productos">Descubre nuestros productos</button>
            </a>
        </div>

        <ul id="lista-carrito">
            <!-- Aquí se mostrarán los productos -->
        </ul>

        <div id="total-carrito">
            <p>Total: <span>€</span><span id="total"></span></p>
        </div>

        <!-- Botón de compra, sólo visible si el carrito tiene productos -->
        <button id="btn-comprar" style="display: none;">Comprar</button>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; ?>
</body>
</html>
