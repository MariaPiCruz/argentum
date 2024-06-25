'use strict';

/**************************************************/
/* Carrousel                                      */
/**************************************************/
const tira=document.querySelector('#tira-sliders');
const imagen=document.querySelector('.slider1');
const bullet1=document.querySelector('#bullet1');
const bullet2=document.querySelector('#bullet2');
const bullet3=document.querySelector('#bullet3');
let slider=0;
let leftira=0;

function movecarrousel(){
    let ancho=imagen.offsetWidth;
    slider=(slider+1)%4;
    const translateValue=-slider*ancho;
    tira.style.transition='transform 2s ease-in-out';
    tira.style.transform=`translateX(${translateValue}px)`;
    switch (slider){
        case 1:
            bullet1.classList.remove('select');
            bullet2.classList.add('select');
            bullet3.classList.remove('select');
            break;
        case 2:
            bullet1.classList.remove('select');
            bullet2.classList.remove('select');
            bullet3.classList.add('select');
            break;
        case 3:
            bullet1.classList.add('select');
            bullet2.classList.remove('select');
            bullet3.classList.remove('select');
            break;
    }
    
};

let carrouselAuto=setInterval(movecarrousel,7000);

function resetCarousel() {
    slider = 0;
    tira.style.transition = 'transform 0s';
    tira.style.transform = `translateX(0)`;
}

// Restablecer el carrusel cuando se llega al final.
tira.addEventListener('transitionend', function () {
    if (slider === 3) {
        resetCarousel();
    }
});

//al hacer clik en el bullet
function irSlider(s){
    slider = s;
    movecarrousel();
}
