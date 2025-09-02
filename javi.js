/* ============================
   SCRIPT PARA RELOJ (COUNTDOWN)
============================ */
function iniciarCuentaRegresiva(el, fechaFin) {
  function actualizar() {
    const ahora = new Date().getTime();
    const distancia = fechaFin - ahora;

    if (distancia < 0) {
      el.innerHTML = "¡El curso ya empezó!";
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    el.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }

  actualizar();
  setInterval(actualizar, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const countdowns = document.querySelectorAll(".countdown");
  countdowns.forEach(el => {
    const fecha = el.getAttribute("data-fecha");
    if (fecha) {
      iniciarCuentaRegresiva(el, new Date(fecha).getTime());
    }
  });
});

/* ============================
   MODAL DE PAGO
============================ */
function abrirPago(nombreCurso) {
  alert("Has elegido comprar: " + nombreCurso + "\nSelecciona un método de pago abajo.");
  // ⚡ Si prefieres modal en lugar de alert,
  // descomenta estas líneas y crea en tu HTML un modal con id="modalPago" y span id="tituloCurso"
  // document.getElementById("tituloCurso").innerText = nombreCurso;
  // document.getElementById("modalPago").style.display = "flex";
}

function cerrarPago() {
  const modal = document.getElementById("modalPago");
  if (modal) modal.style.display = "none";
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("modalPago");
  if (modal && event.target === modal) {
    cerrarPago();
  }
});

/* ============================
   COPIAR NÚMERO (YAPE / PLIN / TRANSFERENCIA)
============================ */
function copiarNumero(numero) {
  navigator.clipboard.writeText(numero).then(() => {
    mostrarToast("Número copiado: " + numero);
  }).catch(err => {
    console.error("Error al copiar: ", err);
  });
}

/* ============================
   TOAST
============================ */
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.innerText = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ============================
   RESERVA POR WHATSAPP
============================ */
function reservarWhatsApp(nombreCurso) {
  const numero = "51987654321"; // 👉 tu número con código de país (ejemplo: 51 Perú)
  const mensaje = `Hola, quiero reservar el curso: ${nombreCurso}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}


