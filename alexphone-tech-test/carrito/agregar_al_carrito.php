<?php
session_start();
header('Content-Type: application/json'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['producto_id']) && isset($_POST['cantidad'])) {
    $producto_id = intval($_POST['producto_id']);
    $cantidad = intval($_POST['cantidad']);

    if ($producto_id > 0 && $cantidad > 0) { 
        if (!isset($_SESSION['carrito'])) {
            $_SESSION['carrito'] = [];
        }

        $_SESSION['carrito'][$producto_id] = ($_SESSION['carrito'][$producto_id] ?? 0) + $cantidad;
    }
}

// Devolver el nuevo total de productos en el carrito como JSON
echo json_encode(['total' => array_sum($_SESSION['carrito'] ?? [])]);
exit();
