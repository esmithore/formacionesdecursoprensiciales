// api/registro.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Lógica para el registro de usuario
    res.status(200).json({ message: "Registro exitoso" });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
