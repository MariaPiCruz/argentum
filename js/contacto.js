const cuilPrefijo = document.getElementById("cuilPrefijo");
const cuil = document.getElementById("cuil");
const cuilSufijo = document.getElementById("cuilSufijo");
const apellido = document.getElementById("apellido");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const consultaTipo = document.getElementById("consultaTipo");
const consultaTexto = document.getElementById("consultaTexto");
const form = document.getElementById("form");
const listaImputs = document.querySelectorAll(".lista-imputs");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let condicion = validacionForm();
    if(condicion){
        enviarFormulario();
    }

});

function validacionForm(){
    let condicion = true;

    listaImputs.forEach ((element) => {
        element.lastElementChild.innerHTML = "";
    })

    //Validacion de que los campos no esten vacios y su tamaño no sea menor a 1
    if (cuil.value.length != 8 || cuil.value.trim() == "" || cuil.value.length > 8){
        mostrarMensaje("contenedor-cuil", "DNI no valido.");
        condicion = false;
    }

    if (cuilSufijo.value.length != 1 || cuilSufijo.value.trim() == ""){
        mostrarMensaje("contenedor-cuil", "El Sufijo del CUIL debe ser un solo número.");
        condicion = false;
    }

    if (cuil.value.trim() == "" && cuilSufijo.value.trim() == ""){
        mostrarMensaje("contenedor-cuil", "Por favor, complete estos datos.");
        condicion = false;
    }
    
    if (apellido.value.length < 1 || apellido.value.trim() == ""){
        mostrarMensaje("contenedor-apellido", "Apellido no valido.");
        condicion = false;
    }

    if (nombre.value.length < 1 || nombre.value.trim() == ""){
        mostrarMensaje("contenedor-nombre", "Nombre no valido.");
        condicion = false;
    }

    if (correo.value.length < 1 || correo.value.trim() == ""){
        mostrarMensaje("contenedor-correo", "Correo no valido.");
        condicion = false;
    }

    if (validarEmail(correo)){
        mostrarMensaje("contenedor-correo", "Correo no valido.");
        condicion = false;
    }

    if (telefono.value.length > 11 || telefono.value.trim() == ""){
        mostrarMensaje("contenedor-telefono", "Telefono no valido.");
        condicion = false;
    }

    if (consultaTexto.value.trim() == ""){
        mostrarMensaje("contenedor-consultaTexto", "Escriba una consulta.");
        condicion = false;
    }

    return condicion;
}

function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enviarFormulario(){
    form.reset();
    mostrarMensaje("footer-formulario", "Formulario enviado con éxito :)");
}

function mostrarMensaje(claseInput, mensaje){
    let elemento = document.querySelector(`.${claseInput}`);
    elemento.lastElementChild.innerHTML = mensaje;
};

//Labels que sólo aceptan numeros
telefono.addEventListener('keypress', (event) => {
    soloNumeros();
});
cuil.addEventListener('keypress', (event) => {
    soloNumeros();
});
cuilSufijo.addEventListener('keypress', (event) => {
    soloNumeros();
});
function soloNumeros(){
    const keyCode = event.keyCode;
    const isDigit = keyCode >= 48 && keyCode <= 57; // Teclas numéricas del 0 al 9
    const isBackspace = keyCode === 8;
    if (!isDigit && !isBackspace) {
      event.preventDefault();
    }
}

//Labels que sólo aceptan letras
nombre.addEventListener('keypress', (event) => {
    soloLetras();
});
apellido.addEventListener('keypress', (event) => {
    soloLetras();
});
function soloLetras(){
    const keyCode = event.keyCode;
    const isLetter = /[a-zA-Z]/.test(String.fromCharCode(keyCode)); // Letras mayusculas y minisculas
    const isBackspace = keyCode === 8; // Tecla retroceso
    const isSpace = keyCode === 32; // Tecla espacio
    if (!isLetter && !isBackspace && !isSpace) {
      event.preventDefault();
    }
}
