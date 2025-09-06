// api/login.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Lógica para verificar el usuario y la contraseña
    const { username, password } = req.body;

    // Lógica para autenticar al usuario (puedes usar Firebase Auth, JWT, etc.)

    res.status(200).json({ message: "Acceso exitoso" });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
