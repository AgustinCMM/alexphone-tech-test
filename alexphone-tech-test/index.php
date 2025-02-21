<?php
session_start();
$carrito = $_SESSION['carrito'] ?? [];
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <?php
            $url_entorno = '';
            $page_title = 'AlexPhone - Agustín Massa';
            require $url_entorno . 'partials/head.php';
        ?>
    </head>
    <body>
        <?php
            require $url_entorno . 'partials/header.php';
        ?>
        <main>
            <h1>AlexPhone - Agustín Massa</h1>
            <button class="agregar-carrito" data-id="1" data-cantidad="1">Agregar Producto 1</button>
            <button class="agregar-carrito" data-id="2" data-cantidad="1">Agregar Producto 2</button>
        </main>
        <?php
            require $url_entorno . 'partials/footer.php';
        ?>
    </body>
</html>
