/* =========================
   COUNTDOWN
========================= */
function iniciarCuentaRegresiva(el, fechaFin) {
  function actualizar() {
    const ahora = Date.now();
    const distancia = fechaFin - ahora;

    if (distancia < 0) {
      el.textContent = "¡El curso ya empezó!";
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    el.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }

  actualizar();
  setInterval(actualizar, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  /* Iniciar Countdowns */
  document.querySelectorAll(".countdown").forEach(el => {
    const fecha = el.getAttribute("data-fecha");
    if (fecha) iniciarCuentaRegresiva(el, new Date(fecha).getTime());
  });

  /* Mostrar precios preventa vs regular */
  document.querySelectorAll(".curso-card").forEach(card => {
    const preventa = card.querySelector(".precio-preventa");
    const regular  = card.querySelector(".precio");
    const cd = card.querySelector(".countdown");
    let fechaCurso = cd ? new Date(cd.getAttribute("data-fecha")) : null;
    const hoy = new Date();

    if (preventa && regular) {
      if (fechaCurso && hoy < fechaCurso) {
        preventa.style.display = "block";
        regular.style.display  = "none";
      } else {
        preventa.style.display = "none";
        regular.style.display  = "block";
      }
    }
  });

  ajustarPaddingBanner();
  window.addEventListener("resize", ajustarPaddingBanner);

  /* Cerrar aviso global con botón ✖ (si existe) */
  const btnCerrar = document.getElementById("avisoCerrar");
  if (btnCerrar) btnCerrar.addEventListener("click", ocultarAviso);
});

/* =========================
   MODAL DE PAGO
========================= */
function abrirPago(nombreCurso) {
  document.getElementById("tituloCurso").innerText = "Has elegido: " + nombreCurso;
  document.getElementById("modalPago").style.display = "flex";
}
function cerrarPago() {
  document.getElementById("modalPago").style.display = "none";
}
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modalPago");
  if (e.target === modal) cerrarPago();
});

/* =========================
   TOAST
========================= */
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.innerText = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* =========================
   COPIAR CON FEEDBACK
========================= */
function copiarAlPortapapeles(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto);
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }
}

function feedbackBoton(boton) {
  if (!boton) return;
  const textoOriginal = boton.innerHTML;
  boton.innerHTML = "✔️ Copiado";
  boton.classList.add("btn-copiado");
  boton.disabled = true;

  setTimeout(() => {
    boton.innerHTML = textoOriginal;
    boton.classList.remove("btn-copiado");
    boton.disabled = false;
  }, 2000);
}

/* =========================
   AVISOS DENTRO DEL MODAL: solo debajo de los QR
========================= */
let avisoTimeout;

/* Muestra el aviso por 2 minutos */
function showCopyNotice(texto, etiqueta) {
  const box = document.getElementById('copyNotice');
  const label = document.getElementById('copyText');
  if (!box || !label) return;

  const msg = etiqueta ? `Copiado (${etiqueta}): ${texto}` : `Copiado: ${texto}`;
  label.textContent = msg;

  // Mostrar el aviso
  box.hidden = false;

  // Reiniciar el temporizador (2 minutos)
  clearTimeout(avisoTimeout);
  avisoTimeout = setTimeout(() => {
    box.hidden = true;
  }, 120000);
}

function hideCopyNotice() {
  const box = document.getElementById('copyNotice');
  if (!box) return;
  box.hidden = true;
  clearTimeout(avisoTimeout);
}

/* =========================
   Compatibilidad: soporta tanto la firma antigua como la nueva
   - Antiguo: copiarNumero('932...', this)
   - Nuevo:   copiarNumero('932...', 'Yape', this)
========================= */
function _parseArgs(arg2, arg3) {
  let etiqueta = "";
  let btn = null;
  if (typeof arg2 === "string") { etiqueta = arg2; btn = arg3 || null; }
  else { btn = arg2 || null; }
  return { etiqueta, btn };
}

function copiarNumero(numero, arg2, arg3) {
  const { etiqueta, btn } = _parseArgs(arg2, arg3);
  copiarAlPortapapeles(numero).then(() => {
    mostrarToast("Número copiado: " + numero);
    feedbackBoton(btn);
    showCopyNotice(numero, etiqueta);
  });
}
function copiarLocal(numero, arg2, arg3) {
  const { etiqueta, btn } = _parseArgs(arg2, arg3);
  copiarAlPortapapeles(numero).then(() => {
    mostrarToast("Número copiado: " + numero);
    feedbackBoton(btn);
    showCopyNotice(numero, etiqueta);
  });
}
function copiarInterbancario(numero, arg2, arg3) {
  const { etiqueta, btn } = _parseArgs(arg2, arg3);
  copiarAlPortapapeles(numero).then(() => {
    mostrarToast("Número copiado: " + numero);
    feedbackBoton(btn);
    showCopyNotice(numero, etiqueta);
  });
}

/* =========================
   RESERVA WHATSAPP
========================= */
function reservarWhatsApp(nombreCurso) {
  const numero = "51978820283"; // tu número con código país
  const mensaje = `Hola, quiero reservar el curso: ${nombreCurso}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

/* =========================
   BANNER FIJO: empuja el body
========================= */
function ajustarPaddingBanner() {
  const banner = document.getElementById("footerBanner");
  if (!banner) return;

  const styles = window.getComputedStyle(banner);
  const isFixed = styles.position === "fixed";

  if (isFixed) {
    document.body.style.paddingBottom = banner.offsetHeight + 8 + "px";
  } else {
    document.body.style.paddingBottom = "0px";
  }
}

/* Exponer funciones */
window.abrirPago = abrirPago;
window.cerrarPago = cerrarPago;
window.copiarNumero = copiarNumero;
window.copiarLocal = copiarLocal;
window.copiarInterbancario = copiarInterbancario;
window.reservarWhatsApp = reservarWhatsApp;
