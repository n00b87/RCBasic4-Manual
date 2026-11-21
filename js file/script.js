/* ============================================================
   script.js - Slider del hero + efecto 3D de la tarjeta (home.html)
   ============================================================ */

// ---------- SLIDER DEL HERO ----------
const slides = document.querySelectorAll(".slide");
let index = 0;

// Pasa a la siguiente imagen (vuelve a la primera al llegar al final)
function changeSlide() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

// Solo arranca si hay más de un slide y el usuario no pidió menos movimiento
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (slides.length > 1 && !reduceMotion) {
  setInterval(changeSlide, 4000);
}

// ---------- TARJETA 3D (sigue al ratón) ----------
// Antes daba error si .align-img no existía (card === null); ahora se comprueba.
const card = document.querySelector(".align-img");

if (card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    // posición del ratón dentro de la tarjeta
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // inclinación máxima de 15 grados
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  // al salir el ratón, la tarjeta vuelve a su posición
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}
// (se eliminó un console.log("Hola") de depuración)
