let slides = document.querySelectorAll(".slide");
let index = 0;
const card = document.querySelector(".align-img");

function changeSlide(){

slides[index].classList.remove("active");

index++;

if(index >= slides.length){
index = 0;
}

slides[index].classList.add("active");

}

setInterval(changeSlide, 4000);


card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;

    card.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
});

card.addEventListener("mouseleave", () => {
    card.style.transform =
        "rotateX(0deg) rotateY(0deg) scale(1)";
});

console.log("Hola");