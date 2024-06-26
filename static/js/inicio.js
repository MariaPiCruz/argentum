"use strict";

//const url = "http://maripilicruz.pythonanywhere.com/";
const URL = "http://127.0.0.1:5000/";
let clienteInfo;
let cuenta;
let nroCuenta;
let cbu;
let alias;
document.addEventListener("DOMContentLoaded", function () {
  //recuperar datos del sessionStorage
  clienteInfo = JSON.parse(sessionStorage.getItem("cliente_info"));
  cuenta = JSON.parse(sessionStorage.getItem("cuenta"));
  console.log(clienteInfo);
  console.log(cuenta);
  cbu = clienteInfo[5];
  alias = clienteInfo[6];
  let nombre = "" + clienteInfo[1] + " " + clienteInfo[2];

  let nombreUsuario = document.querySelector("#nombreUsuario");
  nombreUsuario.innerHTML = nombre;

  let hola = document.querySelector("#txtHola");
  hola.innerHTML = `Hola, <b>${nombre}</b>`;

  //Recupero los datos de cuenta
  getCuentas();
  getTarjetas();
});

async function getCuentas() {
  try {
    let panelCuentas = document.querySelector("#section-cuentas");
    let cardCuentasHtml = "";

    // Obtener el idTipoCuenta del cliente desde sessionStorage
    let idCliente = clienteInfo[0];

    // Realizar la solicitud GET al servidor para obtener los datos de cuenta
    const response = await fetch(URL + "tipoCuenta/" + idCliente);

    if (!response.ok) {
      throw new Error("Error al obtener los datos de la cuenta.");
    }

    const data = await response.json();
    console.log("Datos de cuenta bancaria: ");
    console.log(data);
    nroCuenta = data[1];

    // Generar el HTML para mostrar las cuentas (aquí puedes adaptar según tu estructura HTML)

    cardCuentasHtml += `
                <div class="card">
                    <h4>${data[0]}</h4>
                    <p>${nroCuenta}</p>
                    <div class="card-saldo">$ <b>${clienteInfo[7]}</b></div>
                    <div class="card-dashed oculto">$ <b>--- --- --</b></div>
                    <div class="card-icon-flex">
                        <a href="movimientos.html"><i class="fa-solid fa-money-bill-transfer"></i> Ver Movimientos</a>
                        <a href="#" onclick="verAliasCbu()"><i class="fa-solid fa-share-nodes"></i> CBU / Alias</a>

                    </div>
                </div>
            `;

    // Insertar el HTML generado en el panel de cuentas
    panelCuentas.innerHTML = cardCuentasHtml;
  } catch (error) {
    console.error("Error en getCuentas:", error);
  }
}

async function getTarjetas() {
    try {
        console.log(clienteInfo[8])
        let idCliente = clienteInfo[0]
        let panelTarjeta = document.querySelector("#section-tarjetas");
        let cardTarjetaHtml = "";

        // Realizar la solicitud GET al servidor para obtener los datos de la tarjeta
        const response = await fetch(URL + "tipoTarjeta/" + idCliente);

        if (!response.ok) {
            throw new Error("Error al obtener los datos de la tarjeta.");
        }

        const data = await response.json();
        console.log("Datos de tarjeta: " + data);
        console.log(data);

        // Generar el HTML para mostrar la tarjeta
        cardTarjetaHtml += `
            <div class="card">
                <h4>${data[3]}</h4>
                <div class="card-line-flex">
                    <p>Número de tarjeta</p>
                    <p><b>${data[0]}</b></p>
                </div>
                <div class="card-line-flex align-end">
                    <p>Vigencia hasta ${data[1]}</p>
                    <img src="../static/images/visaDebito.png" width="40px" alt="Visa Débito">
                </div>
            </div>
        `;

        // Insertar el HTML generado en el panel de tarjetas
        panelTarjeta.innerHTML = cardTarjetaHtml;
    } catch (error) {
        console.error("Error en getTarjetas:", error);
    }
}


function changeViewSaldo() {
  let icono = document.getElementById("viewSaldo");
  let saldo = document.querySelectorAll(".card-saldo");
  let dashed = document.querySelectorAll(".card-dashed");
  if (icono.classList.contains("fa-eye-slash")) {
    icono.classList.remove("fa-eye-slash");
    icono.classList.add("fa-eye");
    saldo[0].classList.add("oculto");
    dashed[0].classList.remove("oculto");
    // saldo[1].classList.add("oculto");
    // dashed[1].classList.remove("oculto");
  } else {
    icono.classList.remove("fa-eye");
    icono.classList.add("fa-eye-slash");
    saldo[0].classList.remove("oculto");
    dashed[0].classList.add("oculto");
    // saldo[1].classList.remove("oculto");
    // dashed[1].classList.add("oculto");
  }
}

function changeViewTarjetas() {
  let icono = document.getElementById("viewTarjetas");
  let consumo = document.querySelectorAll(".card-consumo");
  let dashed = document.querySelectorAll(".card-dashed-consumo");
  if (icono.classList.contains("fa-eye-slash")) {
    icono.classList.remove("fa-eye-slash");
    icono.classList.add("fa-eye");
    // consumo[0].classList.add("oculto");
    // dashed[0].classList.remove("oculto");
    // consumo[1].classList.add("oculto");
    // dashed[1].classList.remove("oculto");
  } else {
    icono.classList.remove("fa-eye");
    icono.classList.add("fa-eye-slash");
    consumo[0].classList.remove("oculto");
    dashed[0].classList.add("oculto");
    // consumo[1].classList.remove("oculto");
    // dashed[1].classList.add("oculto");
  }
}

function copiarAlPortapapeles() {
  // Obtener el texto del textarea
  var texto =
    "Banco Argentum\nTipo y número de cuenta: Cuentas en Pesos  084-366482/3\nNúmero de CBU: 0720084788000036648236 \nAlias de CBU: REGLA.COMICO.PLAN\nTitular de la cuenta: Rivarola Nestor David\nTipo y número de documento: DNI-18306188";

  // Usar la API del portapapeles
  navigator.clipboard
    .writeText(texto)
    .then(function () {
      alert("Texto copiado al portapapeles");
    })
    .catch(function (error) {
      console.error("Error al copiar el texto: ", error);
    });
}

function editAlias() {
  let txtAlias = document.querySelector("#txtAlias");
  txtAlias.setAttribute("contenteditable", true);
  txtAlias.focus();
}


function verAliasCbu() {
  let tit = document.querySelector("#modal-text");
  let modalNroCuenta = document.querySelector("#modal-text-nroCuenta");
  let modalCbu = document.querySelector("#modal-text-cbu");
  let modalAlias = document.querySelector("#txtAlias");
  tit.innerHTML = "Caja de Ahorro en Pesos";
  
  
  modalNroCuenta.innerText = `${nroCuenta}`;
  modalCbu.innerText = `${cbu}`;
  modalAlias.innerText = `${alias}`;
  let modal = document.querySelector("#modal-CBUAlias");
  modal.style = "display: flex";
}

function cerrarModalDC() {
  let modal = document.querySelector("#modal-CBUAlias");
  modal.style = "display: none";
}

function changedMovimientos(pTipo) {
  let pesos = document.querySelector("#card-btn-pesos");
  let dolar = document.querySelector("#card-btn-dolar");
  let tipo = document.querySelector("#tittipoNumero");

  if (pTipo == "pesos") {
    pesos.classList.add("card-selected");
    dolar.classList.remove("card-selected");
    tipo.innerHTML = "Caja de Ahorro en Pesos N° 084-123456 / 3";
  } else {
    dolar.classList.add("card-selected");
    pesos.classList.remove("card-selected");
    tipo.innerHTML = "Caja de Ahorro en Dolares N° 084-123456 / 3";
  }
}
