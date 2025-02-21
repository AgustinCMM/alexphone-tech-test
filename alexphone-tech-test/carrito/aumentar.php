<?php

session_start();
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['producto_id'])) {
    $producto_id = intval($_POST['producto_id']);
    if ($producto_id > 0) {
        $_SESSION['carrito'][$producto_id] = ($_SESSION['carrito'][$producto_id] ?? 0) + 1;
    }
}

echo json_encode(['total' => array_sum($_SESSION['carrito'] ?? [])]);
exit();
