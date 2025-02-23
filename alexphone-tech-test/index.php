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

        <!-- BLOQUE DE FILTROS Y ORDENADO -->
        <div id="filtros">
            <label for="filtro-color">Color:</label>
            <select id="filtro-color">
                <option value="">Todos</option>
                <option value="white">Blanco</option>
                <option value="black">Negro</option>
                <option value="red">Rojo</option>
                <option value="pink">Rosa</option>
            </select>

            <label for="filtro-capacidad">Capacidad:</label>
            <select id="filtro-capacidad">
                <option value="">Todas</option>
                <option value="64">64 GB</option>
                <option value="128">128 GB</option>
                <option value="256">256 GB</option>
                <option value="512">512 GB</option>
            </select>

            <label for="filtro-grade">Estado:</label>
            <select id="filtro-grade">
                <option value="">Todos</option>
                <option value="excellent">Excellent</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
            </select>

            <label for="orden-precio">Ordenar por:</label>
            <select id="orden-precio">
                <option value="">Sin orden</option>
                <option value="asc">Precio Asc</option>
                <option value="desc">Precio Desc</option>
            </select>
        </div>
        <!-- FIN BLOQUE DE FILTROS Y ORDENADO -->

        <section class="productos" id="productos">
            <!-- Aquí se mostrarán los productos -->
        </section>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; // Incluye el pie de página. ?>
</body>
</html>
