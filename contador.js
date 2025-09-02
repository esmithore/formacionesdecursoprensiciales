document.addEventListener("DOMContentLoaded", () => {

/* =====================
       ANIMACIÓN DE CONTADORES
     ====================== */
  (function () {
    const fmt = new Intl.NumberFormat('es-PE');
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
      const target = Number(el.dataset.target || '0');
      const duration = Number(el.dataset.duration || '1600');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';

      // Seguridad
      if (!isFinite(target) || target < 0) {
        el.textContent = prefix + fmt.format(0) + suffix;
        return;
      }

      let startTime = null;

      function frame(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(t);
        const current = Math.min(Math.round(eased * target), target);

        el.textContent = prefix + fmt.format(current) + suffix;

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          // Fuerza el valor final exacto
          el.textContent = prefix + fmt.format(target) + suffix;
          el.dataset.playing = '0';   // terminó de animar
          el.dataset.frozen = '1';    // queda congelado hasta que salga y vuelva a entrar
        }
      }

      // Arranque
      el.dataset.playing = '1';
      el.classList.add('visible');
      requestAnimationFrame(frame);
    }

    // Resetea el contenido a 0 (formateado) sin animación
    function resetCounter(el) {
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      el.textContent = prefix + '0' + suffix;
      el.dataset.frozen = '0';
    }

    const counters = document.querySelectorAll('.counter');

    if (counters.length) {
      // Inicializa todos en 0 para consistencia
      counters.forEach(resetCounter);

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          const target = Number(el.dataset.target || '0');
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';

          if (entry.isIntersecting) {
            // Si viene de estar fuera y estaba "congelado", ahora se arma para reiniciar
            if (el.dataset.frozen === '1') {
              resetCounter(el); // vuelve a 0 al re-entrar
            }
            // Si no está animando y no está ya en el target, animamos
            const atTarget = el.textContent === (prefix + new Intl.NumberFormat('es-PE').format(target) + suffix);
            if (el.dataset.playing !== '1' && !atTarget) {
              animateCounter(el);
            }
          } else {
            // Al salir de viewport: no lo reseteamos en este momento,
            // solo lo marcamos como "congelado" si alcanzó target.
            const reached = el.textContent === (prefix + new Intl.NumberFormat('es-PE').format(target) + suffix);
            if (reached) {
              el.dataset.frozen = '1';
            }
            el.classList.remove('visible');
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(el => io.observe(el));
    }
  })();

    /* =====================
       SLIDER DE TESTIMONIOS
    ====================== */
    let currentIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
    // Elimina la clase 'active' del testimonio actual
    testimonials[currentIndex].classList.remove('active');

    // Establece el nuevo índice del testimonio
    currentIndex = index;

    // Añade la clase 'active' al siguiente testimonio
    testimonials[currentIndex].classList.add('active');
}

// Función para mover los testimonios hacia la izquierda
function nextTestimonial() {
    const nextIndex = (currentIndex + 1) % totalTestimonials; // Avanza al siguiente testimonio
    showTestimonial(nextIndex);
}

// Función para mover los testimonios hacia la derecha
function prevTestimonial() {
    const prevIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials; // Retrocede al testimonio anterior
    showTestimonial(prevIndex);
}

// Inicializa el primer testimonio como activo
showTestimonial(currentIndex);

// Agregar eventos a los botones de navegación
document.querySelector('.next-btn').addEventListener('click', nextTestimonial);
document.querySelector('.prev-btn').addEventListener('click', prevTestimonial);

// Si deseas que el testimonio cambie automáticamente cada cierto tiempo, puedes usar setInterval:
setInterval(nextTestimonial, 5000); // Cambiar automáticamente cada 5 segundos


    /* =====================
       FAQ - Preguntas Frecuentes
    ====================== */
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            document.querySelectorAll(".faq-answer").forEach(answer => {
                answer.style.display = "none";
            });
            const answer = question.nextElementSibling;
            answer.style.display = "block";
        });
    });

    /* =====================
       MODALES: ACCESO Y REGISTRO
    ====================== */
    const modalAcceso = document.getElementById("modal-acceso");
    const btnAcceso = document.querySelector(".btn-acceso");
    const closeAcceso = document.querySelector(".close-acceso");

    const modalRegistro = document.getElementById("modal-registro");
    const btnRegistro = document.querySelector(".btn-registro");
    const closeRegistro = document.querySelector(".close-registro");

    if (btnAcceso && modalAcceso) {
        btnAcceso.addEventListener("click", () => modalAcceso.style.display = "flex");
    }
    if (closeAcceso) {
        closeAcceso.addEventListener("click", () => modalAcceso.style.display = "none");
    }

    if (btnRegistro && modalRegistro) {
        btnRegistro.addEventListener("click", () => modalRegistro.style.display = "flex");
    }
    if (closeRegistro) {
        closeRegistro.addEventListener("click", () => modalRegistro.style.display = "none");
    }

    const openRegistro = document.getElementById("openRegistro");
    if (openRegistro) {
        openRegistro.addEventListener("click", (e) => {
            e.preventDefault();
            modalAcceso.style.display = "none";
            modalRegistro.style.display = "flex";
        });
    }

    const openAcceso = document.getElementById("openAcceso");
    if (openAcceso) {
        openAcceso.addEventListener("click", (e) => {
            e.preventDefault();
            modalRegistro.style.display = "none";
            modalAcceso.style.display = "flex";
        });
    }

    window.addEventListener("click", (e) => {
        if(e.target === modalAcceso) modalAcceso.style.display = "none";
        if(e.target === modalRegistro) modalRegistro.style.display = "none";
    });

    /* =====================
       COUNTDOWN (para cursos)
    ====================== */
    const countdowns = document.querySelectorAll(".countdown");
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

    countdowns.forEach(el => {
        const fecha = el.getAttribute("data-fecha");
        if (fecha) {
            iniciarCuentaRegresiva(el, new Date(fecha).getTime());
        }
    });

    /* =====================
       PAGO Y WHATSAPP
    ====================== */
    window.copiarNumero = function(numero) {
        navigator.clipboard.writeText(numero).then(() => {
            mostrarToast("Número copiado: " + numero);
        }).catch(err => console.error("Error al copiar: ", err));
    };

    window.abrirPago = function(nombreCurso) {
        alert("Has elegido comprar: " + nombreCurso + "\nSelecciona un método de pago abajo.");
    };

    window.reservarWhatsApp = function(nombreCurso) {
        const numero = "51987654321"; 
        const mensaje = `Hola, quiero reservar el curso: ${nombreCurso}`;
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    };

    function mostrarToast(mensaje) {
        const toast = document.getElementById("toast");
        toast.innerText = mensaje;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

});
