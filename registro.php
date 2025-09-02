<form id="form-register" class="formulario" method="POST" action="registro.php">
    <input type="text" name="nombre" placeholder="Nombre completo" required>
    <input type="email" name="email" placeholder="Correo electrónico" required>
    <input type="password" name="password" placeholder="Contraseña" required>
    <button type="submit" class="btn-registrar">Registrarse</button>
</form>

<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "INSERT INTO user_usarios_p (nombre, email, password) VALUES ('$nombre','$email','$password')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Usuario registrado con éxito'); window.location='index.html';</script>";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
