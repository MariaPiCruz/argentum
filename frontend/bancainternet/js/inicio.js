'use strict';

//const url = "http://maripilicruz.pythonanywhere.com/";
const url = "http://127.0.0.1:5000/"

document.addEventListener('DOMContentLoaded', function() {
    let nombreUsuario = document.querySelector('#nombreUsuario');
    nombreUsuario.innerHTML = `${sessionStorage.getItem('api').toUpperCase()} ${sessionStorage.getItem('nom').toUpperCase()}`;

    let hola = document.querySelector('#txtHola');
    hola.innerHTML = `Hola, <b>${sessionStorage.getItem('nom').split(' ')[0]}</b>`;

    //Recupero los datos de cuenta
    getCuentas();
});

async function getCuentas(){
    try{
        let panelCuentas = document.querySelector('#section-cuentas');
        let cardCuentasHtml = '';

        const response = await fetch(url + `cuentas/${sessionStorage.getItem('cuil')}`,
        {
            mode: 'cors'
        }); 

        const data = await response.json();

        sessionStorage.setItem('cuentas', JSON.stringify(data));

        data.forEach(cuenta => {
            cardCuentasHtml += `
                <div class="card">
                    <h4>Caja de Ahorro en ${cuenta.moneda==1?'Pesos':'USD'}</h4>
                    <p>${cuenta.nrocuenta}</p>
                    <div class="card-saldo">$ <b>${cuenta.saldo}</b></div>
                    <div class="card-dashed oculto">$ <b>--- --- --</b></div>
                    <div class="card-icon-flex">
                        <a href="movimientos.html"><i class="fa-solid fa-money-bill-transfer"></i> Ver Movimientos</a>
                        <a href="#" onclick="verAliasCbu('pesos')"><i class="fa-solid fa-share-nodes"></i> CBU / Alias</a>

                    </div>
                </div>
            `;
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

function changeViewTarjetas(){
    let icono = document.getElementById('viewTarjetas');
    let consumo = document.querySelectorAll('.card-consumo');
    let dashed = document.querySelectorAll('.card-dashed-consumo');
    if (icono.classList.contains('fa-eye-slash')) {
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
        consumo[0].classList.add('oculto');
        dashed[0].classList.remove('oculto')
        consumo[1].classList.add('oculto');
        dashed[1].classList.remove('oculto')
    } else {
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
        consumo[0].classList.remove('oculto');
        dashed[0].classList.add('oculto')
        consumo[1].classList.remove('oculto');
        dashed[1].classList.add('oculto');
    }    
}

function copiarAlPortapapeles() {
    // Obtener el texto del textarea
    var texto = 'Banco Argentum\nTipo y número de cuenta: Cuentas en Pesos  084-366482/3\nNúmero de CBU: 0720084788000036648236 \nAlias de CBU: REGLA.COMICO.PLAN\nTitular de la cuenta: Rivarola Nestor David\nTipo y número de documento: DNI-18306188';
    
    // Usar la API del portapapeles
    navigator.clipboard.writeText(texto).then(function() {
        alert('Texto copiado al portapapeles');
    }).catch(function(error) {
        console.error('Error al copiar el texto: ', error);
    });
}

function editAlias(){
    let alias = document.querySelector('#txtAlias');
    alias.setAttribute('contenteditable',true);
    alias.focus();
}

function verAliasCbu(pTipo){
    let tit = document.querySelector('#modal-text');
    if(pTipo=='pesos'){
        tit.innerHTML="Caja de Ahorro en Pesos";
    }else{
        tit.innerHTML="Caja de Ahorro en Dolares";
    };
    let modal = document.querySelector('#modal-CBUAlias');
    modal.style = "display: flex";
}

function cerrarModalDC(){
    let modal = document.querySelector('#modal-CBUAlias');
    modal.style = "display: none";
}

function changedMovimientos(pTipo){
    let pesos = document.querySelector('#card-btn-pesos');
    let dolar = document.querySelector('#card-btn-dolar');
    let tipo = document.querySelector('#tittipoNumero');

    if(pTipo=='pesos'){
        pesos.classList.add('card-selected');
        dolar.classList.remove('card-selected');
        tipo.innerHTML = "Caja de Ahorro en Pesos N° 084-123456 / 3"
    }else{
        dolar.classList.add('card-selected');
        pesos.classList.remove('card-selected');
        tipo.innerHTML = "Caja de Ahorro en Dolares N° 084-123456 / 3"
    };

}