'use strict';

//const url = "http://maripilicruz.pythonanywhere.com/";
const url = "http://127.0.0.1:5000/"

document.addEventListener('DOMContentLoaded', function() {
    let nombreUsuario = document.querySelector('#nombreUsuario');
    nombreUsuario.innerHTML = `${sessionStorage.getItem('api').toUpperCase()} ${sessionStorage.getItem('nom').toUpperCase()}`;

    let hola = document.querySelector('#txtHola');
    hola.innerHTML = `Hola, <b>${sessionStorage.getItem('nom').split(' ')[0]}</b>`;
    
    getCuentas();

    let cuentas = sessionStorage.getItem('cuentas');
    let data = JSON.parse(cuentas);

    //Recupero los datos de cuenta
    getMovimientos(data[0].cliente, data[0].id);
});

function getCuentas(){
    try{
        let panelCuentas = document.querySelector('#section-cuentas');
        let cardCuentasHtml = '';

        let cuentas = sessionStorage.getItem('cuentas');
        let data = JSON.parse(cuentas);

        let cardSelected = 'card-selected';

        data.forEach(cuenta => {
            cardCuentasHtml += `
                <div class="card-btn ${cardSelected}" onclick="getMovimientos('${cuenta.cliente}','${cuenta.id}')">
                    <h4>Caja de Ahorro en ${cuenta.moneda==1?'Pesos':'USD'}</h4>
                    <p>${cuenta.nrocuenta}</p>
                    <div class="card-saldo">$ <b>${cuenta.saldo}</b></div>
                    <div class="card-dashed oculto">$ <b>--- --- --</b></div>
                </div>
            `;
            cardSelected = '';
        });
        panelCuentas.innerHTML = cardCuentasHtml;

    }catch(e){
        console.log(e.description);
    };
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
        let grilla = document.querySelector('#table-movimientos');

        const response = await fetch(url + `movimientos/${pCliente}/${pNroCta}`,
        {
            mode: 'cors',
        }); 

        const data = await response.json();
        if(data.status===undefined){
            let grdMovimientosHtml = `
                <div class="grid-item text-bold">Fecha</div>
                <div class="grid-item text-bold">Nro.Transacción</div>
                <div class="grid-item text-bold">Descripcion</div>
                <div class="grid-item text-bold">Importe</div>
                <div class="grid-item text-bold">Saldo</div>
            `;
    
            data.forEach(movi => {
                grdMovimientosHtml += `
                    <div class="grid-item">${convertAndFormatDate(movi.fecha)}</div>
                    <div class="grid-item">${movi.nrotransaccion}</div>
                    <div class="grid-item">${movi.descripcion}</div>
                    <div class="grid-item txt-align-right">${movi.importe}</div>
                    <div class="grid-item txt-align-right">${movi.saldo}</div>
                `;
            });
            grilla.innerHTML = grdMovimientosHtml;
        }else{
            grilla.innerHTML = `<h4>${data.response}</h4>`;
        };

    }catch(e){
        console.log(e.message);
    };
}

