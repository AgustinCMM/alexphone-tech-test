<!DOCTYPE html>
<html lang="es">
<head>
    <?php
    $url_entorno = ''; // Ruta base para las URLs del entorno.
    $page_title = 'AlexPhone - Agustín Massa'; // Título de la página.
    require $url_entorno . 'partials/head.php'; // Incluye la cabecera.
    ?>
</head>
<body>
    <?php require $url_entorno . 'partials/header.php'; // Incluye el header con el logo y el carrito. ?>

    <main id="index">
        <h1>AlexPhone - Agustín Massa</h1>
        <section class="productos" id="productos">
            <!-- Aquí se mostrarán los productos -->
        </section>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; // Incluye el pie de página. ?>
</body>
</html>
