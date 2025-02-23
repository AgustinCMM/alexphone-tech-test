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

    <!-- Mensaje de éxito cuando se añade al carrito -->
    <div id="mensaje-exito" class="mensaje-exito" style="display: none;"></div>

    <main id="index">
        <h1>AlexPhone - Agustín Massa</h1>

        <!-- Bloque de filtros -->
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
                <option value="excellent">Excelente</option>
                <option value="very_good">Muy bueno</option>
                <option value="good">Satisfactorio</option>
            </select>

            <label for="orden-precio">Ordenar por:</label>
            <select id="orden-precio">
                <option value="">Sin orden</option>
                <option value="asc">Precio Asc</option>
                <option value="desc">Precio Desc</option>
            </select>
        </div>
        <!-- Fin bloque de filtros -->

        <section class="productos" id="productos">
            <!-- Aquí se mostrarán los productos obtenidos de la API -->
        </section>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; // Incluye el pie de página. ?>
</body>
</html>
