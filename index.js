// Importar funciones de Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Inicializar Firebase Auth
const auth = getAuth();

// Referencias a los formularios
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");

// Elementos de los botones
const btnLogin = document.querySelector(".btn-ingresar");
const btnRegister = document.querySelector(".btn-registrar");
const btnLogout = document.getElementById("btnLogout");

// Función para registrar un nuevo usuario
formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = formRegister.email.value;
  const password = formRegister.password.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Usuario registrado con éxito");
    formRegister.reset();
  } catch (error) {
    alert("Error al registrar el usuario: " + error.message);
  }
});

// Función para iniciar sesión
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = formLogin.email.value;
  const password = formLogin.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Usuario logueado con éxito");
    formLogin.reset();
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});

// Función para cerrar sesión
btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Sesión cerrada");
  } catch (error) {
    alert("Error al cerrar sesión: " + error.message);
  }
});

// Observador de cambios de estado de autenticación
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuario está logueado
    console.log("Usuario logueado:", user);
    btnLogout.style.display = "block";  // Mostrar el botón de logout
    // Aquí puedes mostrar información de la cuenta o redirigir a otra página si lo deseas
  } else {
    // Usuario no logueado
    btnLogout.style.display = "none";  // Ocultar el botón de logout
  }
});
