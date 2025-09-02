<form id="form-login" class="formulario" method="POST" action="login.php">
    <input type="email" name="email" placeholder="Correo electrónico" required>
    <input type="password" name="password" placeholder="Contraseña" required>
    <button type="submit" class="btn-ingresar">Ingresar</button>
</form>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $file = "usuarios.json";

    if (!file_exists($file)) {
        die("❌ No hay usuarios registrados.");
    }

    $usuarios = json_decode(file_get_contents($file), true);

    foreach ($usuarios as $u) {
        if ($u['email'] === $email && password_verify($password, $u['password'])) {
            echo "✅ Bienvenido, " . htmlspecialchars($u['nombre']) . ". <a href='index.php'>Volver</a>";
            exit;
        }
    }

    echo "❌ Usuario o contraseña incorrectos. <a href='index.php'>Volver</a>";
}
?>


