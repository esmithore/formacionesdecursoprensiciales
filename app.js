// Configuración Firebase (asegúrate de que esto esté correctamente importado)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para registrar usuario
const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Agregar información del usuario a Firestore (si es necesario)
        await addDoc(collection(db, "usuarios"), {
            email: email,
            uid: user.uid,
            createdAt: new Date()
        });

        console.log('Usuario registrado exitosamente');
    } catch (error) {
        console.error("Error al registrar usuario: ", error.message);
    }
};

// Función para iniciar sesión
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario logueado:', userCredential.user);
    } catch (error) {
        console.error("Error al iniciar sesión: ", error.message);
    }
};

// Lógica para manejar el formulario de registro
document.getElementById("form-register").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    registerUser(email, password);
});

// Lógica para manejar el formulario de login
document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    loginUser(email, password);
});

// Obtener elementos de los botones y modales
const modalAcceso = document.getElementById("modal-acceso");
const modalRegistro = document.getElementById("modal-registro");
const openAcceso = document.getElementById("openAcceso");
const openRegistro = document.getElementById("openRegistro");
const closeAcceso = document.querySelector(".close-acceso");
const closeRegistro = document.querySelector(".close-registro");

// Abrir y cerrar modales
openAcceso.addEventListener("click", () => {
    modalAcceso.style.display = "block";  // Abre el modal de acceso
    modalRegistro.style.display = "none";  // Cierra el modal de registro si está abierto
});

openRegistro.addEventListener("click", () => {
    modalRegistro.style.display = "block";  // Abre el modal de registro
    modalAcceso.style.display = "none";  // Cierra el modal de acceso si está abierto
});

closeAcceso.addEventListener("click", () => {
    modalAcceso.style.display = "none";  // Cierra el modal de acceso
});

closeRegistro.addEventListener("click", () => {
    modalRegistro.style.display = "none";  // Cierra el modal de registro
});
