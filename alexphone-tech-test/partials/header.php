<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<header>
    <nav class="navbar">
        <div class="logo">
            <a href="<?php echo $url_entorno; ?>index.php">
                <img src="<?php echo $url_entorno; ?>img/logo-alexphone-main-header.svg" alt="AlexPhone Logo">
            </a>
        </div>
        <div class="carrito">
            <a href="<?php echo $url_entorno; ?>carrito.php">
                <img src="<?php echo $url_entorno; ?>img/shopping-car-white.svg" alt="Carrito">
                <span id="contador-carrito" <?php echo (array_sum($_SESSION['carrito'] ?? []) > 0) ? '' : 'style="display:none"'; ?>>
                    <?php echo array_sum($_SESSION['carrito'] ?? []); ?>
                </span>
            </a>
        </div>
    </nav>
</header>
