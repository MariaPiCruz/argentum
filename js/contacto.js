const cuilPrefijo = document.getElementById("cuilPrefijo");
const cuil = document.getElementById("cuil");
const cuilSufijo = document.getElementById("cuilSufijo");
const apellido = document.getElementById("apellido");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const consultaTexto = document.getElementById("consultaTexto");
const form = document.getElementById("form");
const listaImputs = document.querySelectorAll(".lista-imputs");


form.addEventListener("submit", (e) => {
    e.preventDefault();

    //Sirve para borrar la etiqueta p (ultimo hijo de cada clase lista-imputs)
    listaImputs.forEach((element) => {
        element.lastElementChild.innerHTML = "";
    })

    //Validacion de que los campos no esten vacios y su tamaño no sea menor a 1
    if (cuil.value.length < 1 || cuil.value.trim() == "" || cuil.value.length > 8){
        mostrarMensajeError("cuil", "DNI no valido.");
    }

    if (cuilSufijo.value.length > 1 || cuilSufijo.value.trim() == ""){
        mostrarMensajeError("cuilSufijo", "Solo puede contener un sólo número.");
    }
    
    if (apellido.value.length < 1 || apellido.value.trim() == ""){
        mostrarMensajeError("apellido", "Apellido no valido.");
    }

    if (nombre.value.length < 1 || nombre.value.trim() == ""){
        mostrarMensajeError("nombre", "Nombre no valido.");
    }

    if (correo.value.length < 1 || correo.value.trim() == ""){
        mostrarMensajeError("correo", "Correo no valido.");
    }

    if (telefono.value.length != 11 || telefono.value.trim() == ""){
        mostrarMensajeError("telefono", "Telefono no valido.");
    }

    if (consultaTexto.value.trim() == ""){
        mostrarMensajeError("consultaTexto", "Escriba una consulta.");
    }
});

function mostrarMensajeError(idInput, mensaje){
    let elemento = document.querySelector(`.${idInput}`);
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

