'use strict';

const url = "http://maripilicruz.pythonanywhere.com/";
//const url = "http://127.0.0.1:5000/"
let formulario = document.querySelector("#form-login");
let usuario = document.querySelector("#usuario");
let clave = document.querySelector("#clave");
let dni = document.querySelector("#dni");
let recordar = document.querySelector("#recordar");
let msjValida = document.querySelector("#mensaje-valida");

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('doc') !== null) {
        dni.value = localStorage.getItem('doc');
        recordar.checked = true;
    };
});

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    
    if(validarDatos()){
        msjValida.innerHTML="";
        const data = new FormData();
        data.append('doc', dni.value);
        data.append('usu', usuario.value);
        data.append('psw', clave.value);
        fetch(url+'login',
        {
            method: 'POST', 
            body: data,
            headers: {
                "accept": 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.status===undefined){
                sessionStorage.setItem('id', data[0].id);
                sessionStorage.setItem('api', data[0].apellido);
                sessionStorage.setItem('nom', data[0].nombres);
                sessionStorage.setItem('email', data[0].email);
                sessionStorage.setItem('cuil', data[0].cuil);
                sessionStorage.setItem('dni', data[0].dni);
                sessionStorage.setItem('usu', data[0].usuario);
                sessionStorage.setItem('psw', data[0].clave);
                if(recordar.checked){
                    localStorage.setItem('doc',dni.value);
                }else{
                    localStorage.removeItem('doc');
                }
                window.location.href = "inicio.html";
            }else{
                msjValida.innerHTML="* Usuario o clave erronea.";
            }
        });
    }else{      
        msjValida.innerHTML="* Completar los campos marcados en rojo.";
    };
});

usuario.addEventListener("keypress", (event) => {
    if(event.key === 'Enter'){
        formulario.submit();
    };
});

function validarDatos(){
    let valido = true;

    if(dni.value==""){
        valido=false;
        dni.classList.add('border-alert');
    }else{
        dni.classList.remove('border-alert');
    };
    if(usuario.value==""){
        valido=false;
        usuario.classList.add('border-alert');
    }else{
        usuario.classList.remove('border-alert');
    };
    if(clave.value==""){
        valido=false;
        clave.classList.add('border-alert');
    }else{
        clave.classList.remove('border-alert');
    };
        
    return valido;
};
