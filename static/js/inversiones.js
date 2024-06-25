// Selecciona los elementos necesarios del DOM
let sliderInner = document.querySelector(".slider-inner");
let images = sliderInner.querySelectorAll("img");
let paginationSpans = document.querySelectorAll(".slider-pagination span");
let index = 0; // Inicia en 0 para la primera imagen

// Función para cambiar la imagen automáticamente cada 5 segundos
function changeImage() {
    let porcentaje = index * -100;
    sliderInner.style.transform = "translateX(" + porcentaje + "%)";
    
    // Cambia el color del span activo (punto de paginación) a rojo
    paginationSpans.forEach((span, i) => {
        if (i === index) {
            span.style.color = "var(--color-primary)";
        }
        else {
            span.style.color = "#888";
        }
    });
    
    index++;
    if (index >= images.length) {
        index = 0;
    }
}

// Intervalo para cambiar automáticamente las imágenes
let intervalId = setInterval(changeImage, 5000);

// Agrega evento click a cada span de paginación
paginationSpans.forEach((span, i) => {
    span.addEventListener("click", () => {
        // Detiene el intervalo
        clearInterval(intervalId);
        
        // Cambia al índice correspondiente al span clickeado
        index = i;
        changeImage(); // Cambia la imagen manualmente
        
        // Reinicia el intervalo después de 5 segundos
        intervalId = setInterval(changeImage, 5000);
    });
});
