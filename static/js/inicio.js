"use strict";

const url = "http://maripilicruz.pythonanywhere.com/";
//const URL = "http://127.0.0.1:5000/";

let cliente = JSON.parse(sessionStorage.getItem("cliente_info")) || {};

document.addEventListener("DOMContentLoaded", function () {
  if (cliente.nombreCliente && cliente.apellidoCliente) {
    document.querySelector("#nombreUsuario").innerHTML = `${cliente.nombreCliente} ${cliente.apellidoCliente}`;
    document.querySelector("#txtHola").innerHTML = `Hola, <b>${cliente.nombreCliente}</b>`;
    document.getElementById("nroCuenta").textContent = cliente.nroCuenta || "No disponible";
    document.getElementById("saldo").textContent = cliente.saldo || "No disponible";
  }
});

async function ObtenerDatosTarjeta() {
  try {
    const response = await fetch(`${URL}tipoTarjeta/${cliente.idCliente}`);
    if (!response.ok) throw new Error("Error al obtener los datos de la tarjeta.");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function changeViewTarjetas() {
  let icono = document.getElementById("viewTarjetas");
  let campoNroTarjeta = document.getElementById("nroTarjeta");
  let campoFechaVigencia = document.getElementById("fechaVigencia");
  let campoCodigoSeguridad = document.getElementById("codigoSeguridad");
  let campoNombreTitularTarjeta = document.getElementById("nombreTitularTarjeta");

  try {
    if (icono.classList.contains("fa-eye-slash")) {
      icono.classList.remove("fa-eye-slash");
      icono.classList.add("fa-eye");
      let datosTarjeta = await ObtenerDatosTarjeta();
      if (datosTarjeta) {
        campoNroTarjeta.textContent = datosTarjeta[0] || "No disponible";
        campoFechaVigencia.textContent = `Vigencia hasta ${datosTarjeta[1] || "-----"}`;
        campoCodigoSeguridad.textContent = datosTarjeta[2] || "***";
        campoNombreTitularTarjeta.textContent = `${cliente.nombreCliente} ${cliente.apellidoCliente}`;
      }
    } else {
      icono.classList.remove("fa-eye");
      icono.classList.add("fa-eye-slash");
      campoNroTarjeta.textContent = "**********";
      campoCodigoSeguridad.textContent = "***";
      campoFechaVigencia.textContent = "Vigencia hasta -----";
      campoNombreTitularTarjeta.textContent = "--------";
    }
  } catch (error) {
    console.error(error.message);
  }
}

function changeViewSaldo() {
  let icono = document.getElementById("viewSaldo");
  let saldo = document.querySelectorAll(".card-saldo");
  let dashed = document.querySelectorAll(".card-dashed");

  if (icono.classList.contains("fa-eye-slash")) {
    icono.classList.remove("fa-eye-slash");
    icono.classList.add("fa-eye");
    saldo.forEach(el => el.classList.add("oculto"));
    dashed.forEach(el => el.classList.remove("oculto"));
  } else {
    icono.classList.remove("fa-eye");
    icono.classList.add("fa-eye-slash");
    saldo.forEach(el => el.classList.remove("oculto"));
    dashed.forEach(el => el.classList.add("oculto"));
  }
}

function copiarAlPortapapeles() {
  const texto = `
    Banco Argentum
    Tipo y número de cuenta: ${cliente.tipoCuenta || "No disponible"}  ${cliente.nroCuenta || "No disponible"}
    Número de CBU: ${cliente.cbu || "No disponible"} 
    Alias de CBU: ${cliente.alias || "No disponible"}
    Titular de la cuenta: ${cliente.nombreCliente || "No disponible"} ${cliente.apellidoCliente || "No disponible"}
    Tipo y número de documento: 
  `;

  navigator.clipboard.writeText(texto)
    .then(() => alert("Texto copiado al portapapeles"))
    .catch(error => console.error("Error al copiar el texto: ", error));
}

function editAlias() {
  let txtAlias = document.querySelector("#txtAlias");
  const pencil = document.querySelector('#aliasPencil');
  const btnEdit = document.querySelector('#btnEdit');

  pencil.classList.add('oculto');
  btnEdit.classList.remove('oculto');
  
  txtAlias.setAttribute("contenteditable", true);
  txtAlias.focus();
}

function verAliasCbu() {
  document.querySelector("#modal-text").innerHTML = "Caja de Ahorro en Pesos";
  document.querySelector("#modal-text-nroCuenta").innerText = cliente.nroCuenta || "No disponible";
  document.querySelector("#modal-text-cbu").innerText = cliente.cbu || "No disponible";
  document.querySelector("#txtAlias").innerText = cliente.alias || "No disponible";
  document.querySelector("#modal-CBUAlias").style.display = "flex";
}

function cerrarModalDC() {
  document.querySelector("#modal-CBUAlias").style.display = "none";
}

function saveAlias(){
  let txtAlias = document.querySelector("#txtAlias");

  const params = new FormData();
  params.append('id', cliente.idCliente);
  params.append('alias', txtAlias.innerHTML);

  try {
    fetch(URL+'alias',
    {
        method: 'PUT', 
        body: params,
        headers: {
            "accept": 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('status', data.status);
        cliente.alias = txtAlias.innerHTML;
        console.log('cliente[]', cliente);
        cancelAlias();
    });
  } catch (error) {
      console.log('Se produjo un error:', error);
  };
};

function cancelAlias(){
  const pencil = document.querySelector('#aliasPencil');
  const btnEdit = document.querySelector('#btnEdit');

  pencil.classList.remove('oculto');
  btnEdit.classList.add('oculto');
};

// function changedMovimientos(pTipo) {
//   let pesos = document.querySelector("#card-btn-pesos");
//   let dolar = document.querySelector("#card-btn-dolar");
//   let tipo = document.querySelector("#tittipoNumero");

//   if (pTipo == "pesos") {
//     pesos.classList.add("card-selected");
//     dolar.classList.remove("card-selected");
//     tipo.innerHTML = "Caja de Ahorro en Pesos N° 084-123456 / 3";
//   } else {
//     dolar.classList.add("card-selected");
//     pesos.classList.remove("card-selected");
//     tipo.innerHTML = "Caja de Ahorro en Dolares N° 084-123456 / 3";
//   }
// }
