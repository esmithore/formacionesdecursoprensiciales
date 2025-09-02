// auth.js
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore, doc, setDoc, serverTimestamp,
  collection, getDocs, orderBy, query, getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAnalytics, logEvent }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// 👉 Pon aquí el correo admin real
const ADMIN_EMAIL = "orerodriguezesmithsergio@gmail.com";

const app = window._firebaseApp;
const auth = getAuth(app);
const db   = getFirestore(app);

let analytics = null;
try { analytics = getAnalytics(app); } catch (e) {}

const modalAcceso   = document.getElementById('modal-acceso');
const modalRegistro = document.getElementById('modal-registro');

const btnAbrirAcceso   = document.querySelector('.btn-acceso');
const btnAbrirRegistro = document.querySelector('.btn-registro');
const btnCerrarAcceso   = document.querySelector('.close-acceso');
const btnCerrarRegistro = document.querySelector('.close-registro');

const formLogin    = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

const regNombre = document.getElementById('regNombre');
const regEmail  = document.getElementById('regEmail');
const regPass   = document.getElementById('regPass');

const logEmail = document.getElementById('logEmail');
const logPass  = document.getElementById('logPass');

const regMsg = document.getElementById('regMsg');
const logMsg = document.getElementById('logMsg');

const linkOpenRegistro = document.getElementById('openRegistro');
const linkOpenAcceso   = document.getElementById('openAcceso');

const btnLogout   = document.getElementById('btnLogout');
const miCuentaSec = document.getElementById('mi-cuenta');
const cuentaInfo  = document.getElementById('cuentaInfo');
const adminSec   = document.getElementById('panel-admin');
const totalUsers = document.getElementById('totalUsers');
const btnExport  = document.getElementById('btnExportCsv');

// Helpers modales
function abrir(el){ el.style.display='flex'; }
function cerrar(el){ el.style.display='none'; }
window.addEventListener('click', (e) => {
  if (e.target === modalAcceso) cerrar(modalAcceso);
  if (e.target === modalRegistro) cerrar(modalRegistro);
});
btnAbrirAcceso?.addEventListener('click', () => abrir(modalAcceso));
btnAbrirRegistro?.addEventListener('click', () => abrir(modalRegistro));
btnCerrarAcceso?.addEventListener('click', () => cerrar(modalAcceso));
btnCerrarRegistro?.addEventListener('click', () => cerrar(modalRegistro));
linkOpenRegistro?.addEventListener('click', (e)=>{ e.preventDefault(); cerrar(modalAcceso); abrir(modalRegistro); });
linkOpenAcceso  ?.addEventListener('click', (e)=>{ e.preventDefault(); cerrar(modalRegistro); abrir(modalAcceso); });

// Registro
formRegister?.addEventListener('submit', async (e) => {
  e.preventDefault();
  regMsg.textContent = '';
  try {
    const cred = await createUserWithEmailAndPassword(auth, regEmail.value.trim(), regPass.value);
    if (regNombre.value.trim()) await updateProfile(cred.user, { displayName: regNombre.value.trim() });
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: regNombre.value.trim(),
      email: regEmail.value.trim(),
      createdAt: serverTimestamp()
    });
    if (analytics) logEvent(analytics, 'sign_up', { method: 'password' });
    regMsg.textContent = '¡Registro exitoso!';
    setTimeout(()=> cerrar(modalRegistro), 1200);
  } catch (err) {
    regMsg.textContent = normalizaError(err);
  }
});

// Login
formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  logMsg.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, logEmail.value.trim(), logPass.value);
    if (analytics) logEvent(analytics, 'login', { method: 'password' });
    logMsg.textContent = '¡Bienvenido!';
    setTimeout(()=> cerrar(modalAcceso), 800);
  } catch (err) {
    logMsg.textContent = normalizaError(err);
  }
});

// Logout
btnLogout?.addEventListener('click', () => signOut(auth));

// Estado de sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    miCuentaSec.style.display = 'block';
    btnLogout.style.display = 'inline-block';
    cuentaInfo.textContent = `Sesión: ${user.displayName || user.email}`;
    if ((user.email||'').toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      adminSec.style.display = 'block';
      await refrescaConteo();
    }
  } else {
    miCuentaSec.style.display = 'none';
    btnLogout.style.display = 'none';
    adminSec.style.display = 'none';
    cuentaInfo.textContent = '';
  }
});

// Panel admin
async function refrescaConteo(){
  try {
    const coll = collection(db, 'users');
    const snapshot = await getCountFromServer(coll);
    totalUsers.textContent = snapshot.data().count ?? 0;
  } catch (e) { totalUsers.textContent = '—'; }
}
btnExport?.addEventListener('click', async () => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const rows = [['name','email','createdAt']];
  snap.forEach(docu => {
    const d = docu.data();
    const ts = d.createdAt?.toDate ? d.createdAt.toDate() : null;
    rows.push([d.name||'', d.email||'', ts?ts.toISOString():'']);
  });
  const csv = rows.map(r => r.map(x => `"${(x??'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `usuarios_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

function normalizaError(err){
  const code = (err?.code || '').toLowerCase();
  if (code.includes('email-already-in-use')) return 'Ese correo ya está registrado.';
  if (code.includes('invalid-email')) return 'Correo inválido.';
  if (code.includes('weak-password')) return 'La contraseña es muy débil.';
  if (code.includes('wrong-password')) return 'Correo o contraseña incorrectos.';
  if (code.includes('user-not-found')) return 'Usuario no encontrado.';
  return 'Error: ' + (err?.message || err);
}
