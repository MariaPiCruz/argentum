'use strict';

//const url = "http://maripilicruz.pythonanywhere.com/";
const url = "http://127.0.0.1:5000/"

let cliente = JSON.parse(sessionStorage.getItem("cliente_info")) || {};

document.addEventListener('DOMContentLoaded', function() {
    let nombreUsuario = document.querySelector('#nombreUsuario');
    nombreUsuario.innerHTML = `${cliente.nombreCliente} ${cliente.apellidoCliente}`;
    let hola = document.querySelector('#txtHola');
    hola.innerHTML = `Hola, <b>${cliente.nombreCliente}</b>`;
    
    getCuentas();

    let cuentas = sessionStorage.getItem('cuentas');
    let data = JSON.parse(cuentas);

    //Recupero los datos de cuenta
    getMovimientos(cliente.idCliente, cliente.nroCuenta);
});

function getCuentas(){
    document.getElementById("nroCuenta").textContent = cliente.nroCuenta || "No disponible";
    document.getElementById("saldo").textContent = cliente.saldo || "No disponible";
};

function changeViewSaldo() {
    let icono = document.getElementById('viewSaldo');
    let saldo = document.querySelectorAll('.card-saldo');
    let dashed = document.querySelectorAll('.card-dashed');
    if (icono.classList.contains('fa-eye-slash')) {
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
        saldo[0].classList.add('oculto');
        dashed[0].classList.remove('oculto')
        saldo[1].classList.add('oculto');
        dashed[1].classList.remove('oculto')
    } else {
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
        saldo[0].classList.remove('oculto');
        dashed[0].classList.add('oculto')
        saldo[1].classList.remove('oculto');
        dashed[1].classList.add('oculto');
    }
}

async function getMovimientos(pCliente, pNroCta){
    try{
       let tipoNro = document.querySelector('#tittipoNumero');
        tipoNro.innerHTML = `Caja de Ahorro en Pesos N° ${pNroCta}`;
        let grilla = document.querySelector('#table-movimientos');

        const response = await fetch(url + `movimientos/${pCliente}/${pNroCta}`,
        {
            mode: 'cors',
        }); 

        const data = await response.json();
        
        if(typeof data === 'object'){
            console.log('data movimientos',data);
            let grdMovimientosHtml = `
                <div class="grid-item text-bold">Fecha</div>
                <div class="grid-item text-bold">Nro.Transacción</div>
                <div class="grid-item text-bold">Descripcion</div>
                <div class="grid-item text-bold">Importe</div>
                <div class="grid-item text-bold">Saldo</div>
            `;
    
            data.forEach(movi => {
                console.log('fecha',movi[3]);
                grdMovimientosHtml += `
                    <div class="grid-item">${convertAndFormatDate(movi[3])}</div>
                    <div class="grid-item">${movi[0]}</div>
                    <div class="grid-item">${movi[5]}</div>
                    <div class="grid-item txt-align-right">${movi[6]}</div>
                    <div class="grid-item txt-align-right">${movi[7]}</div>
                `;
            });
            grilla.innerHTML = grdMovimientosHtml;
        }else{
            grilla.innerHTML = `<h4>${data}</h4>`;
        };        
    }catch(e){
        console.log(e.message);
    };
}

