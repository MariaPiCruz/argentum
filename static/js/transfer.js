'use strict';

const url = "https://maripilicruz.pythonanywhere.com/";
//const url = "http://127.0.0.1:5000/"



document.addEventListener('DOMContentLoaded', function() {
    let nombreUsuario = document.querySelector('#nombreUsuario');
    nombreUsuario.innerHTML = `${sessionStorage.getItem('api').toUpperCase()} ${sessionStorage.getItem('nom').toUpperCase()}`;
    
    getAgenda();

});

async function getAgenda(){
    try{
        let grilla = document.querySelector('#table-agenda');
        let pCliente = sessionStorage.getItem('cuil');

        const response = await fetch(url + `agenda/${pCliente}`,
        {
            mode: 'cors',
        }); 

        const data = await response.json();
        if(data.status===undefined){
            let grdAgendaHtml = `
                <div class="grid-item text-bold">Cuil</div>
                <div class="grid-item text-bold">Descripción/Nombre</div>
                <div class="grid-item text-bold">CBU/CVU</div>
                <div class="grid-item text-bold">Banco</div>
                <div class="grid-item text-bold"></div>
            `;
    
            data.forEach(destinatario => {
                grdAgendaHtml += `
                    <div class="grid-item">${destinatario.cuil}</div>
                    <div class="grid-item">${destinatario.nombre}</div>
                    <div class="grid-item">${destinatario.cbu}</div>
                    <div class="grid-item">${destinatario.banco}</div>
                    <div class="grid-item">
                        <span class="fa-solid fa-pencil icon-grid" title="Modificar" onclick="showModalDestinatario('M',${destinatario.id})"></span>
                        <span class="fa-solid fa-trash icon-grid" title="Eliminar" onclick="eliminarDestinatario(${destinatario.id},'${destinatario.nombre}')"></span>
                        <span class="fa-solid fa-money-bill-transfer icon-grid" title="Tranferir" onclick="showTransferir(${destinatario.id}, '${destinatario.nombre}')"></span>
                    </div>
                `;
            });
            grilla.innerHTML = grdAgendaHtml;
        }else{
            grilla.innerHTML = `<h4 style="font-size: 16px">${data.response}</h4>`;
        };

        getBancos();

    }catch(e){
        console.log(e.message);
    };
}

async function getBancos(){
    try{
        let banco = document.querySelector('#cboBancos');
        let cboBancoHtml = '<option value=""></option>';

        const response = await fetch(url + 'bancos',
        {
            mode: 'cors',
        }); 

        const data = await response.json();
        if(data.status===undefined){
            data.forEach(banco => {
                cboBancoHtml += `
                    <option value="${banco.nombre}">${banco.nombre}</option>
                `;
            });
            banco.innerHTML = cboBancoHtml;
        }else{
            banco.innerHTML = '<option value=""></option>';
        };

    }catch(e){
        console.log(e.message);
    };
};

function showModalDestinatario(pOper, pId){
    let tit = document.querySelector('#modal-tit-detinatario');
    let oper = document.querySelector('#txtOper');
    let agenda_id = document.querySelector('#txtId');
    let grabar = document.querySelector('#btnGrabar');

    if(pOper=='A'){
        grabar.innerHTML = "Agregar";
    }else{
        grabar.innerHTML = "Modificar";
        agenda_id.value = pId;
        getAgenda4Id(pId);
    };
    oper.value = pOper;

    if(pOper=='A'){
        tit.innerHTML="NUEVO DESTINATARIO";
    }else{
        tit.innerHTML="MODIFICAR DESTINATARIO";
    };
    let modal = document.querySelector('#modal-destinatario');
    modal.style = "display: flex";

};

function cerrarModalDestinatario(){
    let modal = document.querySelector('#modal-destinatario');
    modal.style = "display: none";
    limpiarCampos();
};

function limpiarCampos(){
    let nombre = document.querySelector('#txtNombre');
    let cuil = document.querySelector('#txtCuil');
    let email = document.querySelector('#txteMail');
    let banco = document.querySelector('#cboBancos');
    let cbu = document.querySelector('#txtCBU');
    let alias = document.querySelector('#txtAlias');
    let moneda = document.querySelector('#cboMoneda');

    nombre.value = "";
    cuil.value = "";
    email.value = "";
    banco.value = "";
    cbu.value = "";
    alias.value = "";
    moneda.value = "1";
};

function guardarDatos(){
    let oper = document.querySelector('#txtOper');
    let nombre = document.querySelector('#txtNombre');
    let cuil = document.querySelector('#txtCuil');
    let email = document.querySelector('#txteMail');
    let banco = document.querySelector('#cboBancos');
    let cbu = document.querySelector('#txtCBU');
    let alias = document.querySelector('#txtAlias');
    let moneda = document.querySelector('#cboMoneda');
    
    const params = new FormData();
    params.append('nombre', nombre.value);
    params.append('cuil', cuil.value);
    params.append('email', email.value);
    params.append('banco', banco.value);
    params.append('cbu', cbu.value);
    params.append('alias', alias.value);
    params.append('moneda', moneda.value);
    params.append('cliente', sessionStorage.getItem('cuil'));

    if(oper.value=='A'){
        fetch(url+'agenda',
            {
                method: 'POST', 
                body: params,
                headers: {
                    "accept": 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.status==0){
                    alert(data.response);
                }else{
                    alert(data.response);
                }
                getAgenda();
            });
    }else{
        let destinatario = document.querySelector('#txtId');
        fetch(url+`agenda/${destinatario.value}`,
            {
                method: 'PUT', 
                body: params,
                headers: {
                    "accept": 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.status==0){
                    alert(data.response);
                }else{
                    alert(data.response);
                }
                getAgenda();
            });

    };

    cerrarModalDestinatario();
};

async function getAgenda4Id(pId){
    try{
        const response = await fetch(url + `getagenda/${pId}`,
        {
            mode: 'cors',
        }); 

        const data = await response.json();
        console.log(data);
        if(data.status===undefined){
            let nombre = document.querySelector('#txtNombre');
            let cuil = document.querySelector('#txtCuil');
            let email = document.querySelector('#txteMail');
            let banco = document.querySelector('#cboBancos');
            let cbu = document.querySelector('#txtCBU');
            let alias = document.querySelector('#txtAlias');
            let moneda = document.querySelector('#cboMoneda');

            nombre.value = data[0].nombre;
            cuil.value = data[0].cuil;
            email.value = data[0].email;
            banco.value = data[0].banco;
            cbu.value = data[0].cbu;
            alias.value = data[0].alias;
            moneda.value = data[0].moneda;
        }else{
            alert(data.response);
        };

    }catch(e){
        console.log(e.message);
    };    
}

async function eliminarDestinatario(pId, pNombre){
    if (confirm(`Desea eliminar el destinatario ${pNombre}`)) {
        try{
            const response = await fetch(url+`agenda/${pId}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    "accept": 'application/json'
                }
            });
            const data = await response.json();
            alert(data.response);

            getAgenda();

        }catch (error) {
            console.error(error);
        };
    }
};

//****************************************************************
// Transferencia
//****************************************************************
function showTransferir(pId, pNombre){
    let modal = document.querySelector('#modal-transfer');
    let destinatario_id = document.querySelector('#txtId');
    let destinatario = document.querySelector('#txtDestinatario');
    let cboCuentas = document.querySelector('#cboCuentas');
    destinatario_id.value = pId
    destinatario.value = pNombre;
    modal.style = "display: flex";

    //Cargo combo cuentas
    let cuentas = sessionStorage.getItem('cuentas');
    let data = JSON.parse(cuentas);
    let cuentasHtml='';
    data.forEach(cuenta => {
        cuentasHtml+=`
            <option value='${cuenta.id}'>${cuenta.moneda==1?'CA $...':'CA USD...'}${cuenta.nrocuenta.slice(-6)}  /  $ ${cuenta.saldo}</option>
        `;
    });
    cboCuentas.innerHTML=cuentasHtml;
};

function cerrarModalTransfer(){
    let modal = document.querySelector('#modal-transfer');
    modal.style = "display: none";
    limpiarCamposTransfer();
};

function limpiarCamposTransfer(){
    let destinatario_id = document.querySelector('#txtId');
    let destinatario = document.querySelector('#txtDestinatario');
    let importe = document.querySelector('#txtImporte');
    let origen = document.querySelector('#cboCuentas');
    let concepto = document.querySelector('#cboConcepto');
    let referencia = document.querySelector('#txtReferencia');

    destinatario_id.value = "";
    destinatario.value = "";
    importe.value = "";
    origen.value = "";
    concepto.value = "";
    referencia.value = "";
};

function transferir(){
    let destinatario_id = document.querySelector('#txtId');
    let destinatario = document.querySelector('#txtDestinatario');
    let importe = document.querySelector('#txtImporte');
    let origen = document.querySelector('#cboCuentas');
    let concepto = document.querySelector('#cboConcepto');
    let referencia = document.querySelector('#txtReferencia');
    
    const params = new FormData();
    params.append('cliente', sessionStorage.getItem('cuil'));
    params.append('destinatario_id', destinatario_id.value);
    params.append('destinatario', destinatario.value);
    params.append('importe', importe.value);
    params.append('origen', origen.value);
    params.append('concepto', concepto.value);
    params.append('referencia', referencia.value);
    params.append('fecha', ahora());

    fetch(url+'transferir',
        {
            method: 'POST', 
            body: params,
            headers: {
                "accept": 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.status==0){
                alert(data.response);
            }else{
                alert(data.response);
            }
        });

    cerrarModalTransfer();    
};
