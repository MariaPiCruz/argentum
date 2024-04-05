'use strict';

/*****************************************/
/* Determina cuando se carga la pagina   */
/*****************************************/
window.addEventListener('load', function () {   
    const loading = document.querySelector('.preloader');
    loading.classList.add('loaded');
});

/**********************************************/
/* Cambia el estilo al menú y el boton de ir  */
/* arriba al hacer scroll                     */
/**********************************************/
const header=document.querySelector('header');
const irTop=document.querySelector('#irTop');

// Calcula el punto en el que deseas cambiar el estilo
const visibleBtnUp =50;

// Agrega un evento de desplazamiento (scroll) al documento
window.addEventListener('scroll', () => {
    // Obtiene la posición vertical actual de la página
    const scrollY = window.scrollY;

    // Comprueba si el usuario ha hecho scroll lo suficiente para cambiar el estilo
    if (scrollY >= visibleBtnUp) {
       header.classList.add('header-dark');
       irTop.classList.remove('active');
    } else {
        header.classList.remove('header-dark');
        irTop.classList.add('active');
    }
});

/**************************************************/
/* Evento al hacer click en el boton de ir arriba */
/**************************************************/
irTop.addEventListener("click", function () {
    // Hacemos scroll al tope de la página
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Esto proporciona un efecto de desplazamiento suave
    });
});

