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
    <?php require $url_entorno . 'partials/header.php'; ?>

    <main id="carrito">
        <h1>Carrito de compras</h1>
        <ul id="lista-carrito">
            <?php foreach ($carrito as $producto_id => $cantidad) : ?>
                <li>
                    <div>
                        Producto ID: <?= $producto_id ?> - Cantidad: <span class="cantidad"><?= $cantidad ?></span>
                    </div>
                    <div>
                        <button class="btn-aumentar" data-id="<?= $producto_id ?>">+</button>
                        <button class="btn-disminuir" data-id="<?= $producto_id ?>">-</button>
                        <button class="btn-eliminar" data-id="<?= $producto_id ?>">Eliminar</button>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </main>

    <?php require $url_entorno . 'partials/footer.php'; ?>
</body>
</html>

