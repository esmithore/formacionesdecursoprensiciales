// ==========================================
// COMUNIDAD.JS
// CONTADORES DE CURSOS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const cursos = document.querySelectorAll(".curso-card");


    // ==========================================
    // ACTUALIZAR CONTADORES
    // ==========================================

    function actualizarContadores() {

        const ahora = Date.now();

        cursos.forEach(function (curso) {

            const fechaTexto = curso.dataset.fecha;

            if (!fechaTexto) {
                console.warn(
                    "El curso no tiene data-fecha:",
                    curso.id
                );

                return;
            }


            const fechaCurso = new Date(fechaTexto).getTime();


            // Verificar que la fecha sea válida

            if (isNaN(fechaCurso)) {

                console.error(
                    "Fecha inválida:",
                    fechaTexto,
                    "Curso:",
                    curso.id
                );

                return;
            }


            // ======================================
            // ELEMENTOS DEL CONTADOR
            // ======================================

            const dias = curso.querySelector(".dias");
            const horas = curso.querySelector(".horas");
            const minutos = curso.querySelector(".minutos");
            const segundos = curso.querySelector(".segundos");


            // Verificar elementos

            if (!dias || !horas || !minutos || !segundos) {

                console.warn(
                    "Faltan elementos del contador:",
                    curso.id
                );

                return;
            }


            // ======================================
            // OTROS ELEMENTOS
            // ======================================

            const precioPreventa =
                curso.querySelector(".precio-preventa");

            const precioNormal =
                curso.querySelector(".precio");

            const mensajeInicio =
                curso.querySelector(".mensaje-inicio");


            // ======================================
            // DIFERENCIA DE TIEMPO
            // ======================================

            const diferencia = fechaCurso - ahora;


            // ======================================
            // CURSO AÚN NO COMIENZA
            // ======================================

            if (diferencia > 0) {

                const diasRestantes =
                    Math.floor(
                        diferencia /
                        (1000 * 60 * 60 * 24)
                    );


                const horasRestantes =
                    Math.floor(
                        (diferencia %
                            (1000 * 60 * 60 * 24)) /
                        (1000 * 60 * 60)
                    );


                const minutosRestantes =
                    Math.floor(
                        (diferencia %
                            (1000 * 60 * 60)) /
                        (1000 * 60)
                    );


                const segundosRestantes =
                    Math.floor(
                        (diferencia %
                            (1000 * 60)) /
                        1000
                    );


                // ==================================
                // MOSTRAR CONTADOR
                // ==================================

                dias.textContent =
                    String(diasRestantes).padStart(2, "0");

                horas.textContent =
                    String(horasRestantes).padStart(2, "0");

                minutos.textContent =
                    String(minutosRestantes).padStart(2, "0");

                segundos.textContent =
                    String(segundosRestantes).padStart(2, "0");


                // ==================================
                // PREVENTA
                // ==================================

                if (precioPreventa) {
                    precioPreventa.style.display = "";
                }


                // ==================================
                // PRECIO NORMAL
                // ==================================

                if (precioNormal) {
                    precioNormal.style.display = "none";
                }


                // ==================================
                // MENSAJE
                // ==================================

                if (mensajeInicio) {
                    mensajeInicio.style.display = "none";
                }

            }


            // ======================================
            // CURSO YA COMENZÓ
            // ======================================

            else {

                dias.textContent = "00";
                horas.textContent = "00";
                minutos.textContent = "00";
                segundos.textContent = "00";


                // Ocultar preventa

                if (precioPreventa) {
                    precioPreventa.style.display = "none";
                }


                // Mostrar precio normal

                if (precioNormal) {
                    precioNormal.style.display = "";
                }


                // Mostrar mensaje

                if (mensajeInicio) {
                    mensajeInicio.style.display = "";
                }

            }

        });

    }


    // ==========================================
    // PRIMERA EJECUCIÓN
    // ==========================================

    actualizarContadores();


    // ==========================================
    // ACTUALIZAR CADA SEGUNDO
    // ==========================================

    setInterval(
        actualizarContadores,
        1000
    );

});

