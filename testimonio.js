// =======================
// 🔹 SLIDER DE TESTIMONIOS
// =======================

document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const testimonialImage = document.querySelector('.testimonial-image img');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) testimonial.classList.add('active');
        });

        // Movimiento de parallax leve
        const offset = (index % 2 === 0) ? -10 : 10; // alterna izquierda/derecha
        testimonialImage.style.transform = `translateX(${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) currentIndex = testimonials.length - 1;
        showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= testimonials.length) currentIndex = 0;
        showTestimonial(currentIndex);
    });

    // Auto slide cada 6 segundos
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= testimonials.length) currentIndex = 0;
        showTestimonial(currentIndex);
    }, 6000);

    // Inicializar
    showTestimonial(currentIndex);
});
