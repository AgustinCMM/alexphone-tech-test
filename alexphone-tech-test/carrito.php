<?php
session_start();
$carrito = $_SESSION['carrito'] ?? [];
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <?php
            $url_entorno = '';
            $page_title = 'Carrito de compras';
            require $url_entorno . 'partials/head.php';
        ?>
    </head>
    <body>
        <?php
            require $url_entorno . 'partials/header.php';
        ?>
        <main>
            <h1>Carrito de compras</h1>
            <ul>
                <?php foreach ($carrito as $producto_id => $cantidad) : ?>
                    <li>Producto ID: <?= $producto_id ?> - Cantidad: <?= $cantidad ?></li>
                <?php endforeach; ?>
            </ul>
        </main>
        <?php
            require $url_entorno . 'partials/footer.php';
        ?>
    </body>
</html>
