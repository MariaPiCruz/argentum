document.addEventListener("DOMContentLoaded", function () {
  //primero que todo, validar si hay un usuario ingresado, sino no se deja acceder a esta pagina, se redirige al loguin
  let usuarioAutenticado = sessionStorage.getItem("usuario_autenticado");
  if (usuarioAutenticado != "true") {
    window.location.href = "loguin.html"; // Redirigir al loguin
  }
});

function formatDate(date) {
  // Extraer el día, el mes y el año de la fecha proporcionada
  let day = date.getDate();
  let month = date.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
  let year = date.getFullYear();

  // Asegurarse de que el día y el mes tengan dos dígitos
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // Construir la cadena con el formato dd-mm-yyyy
  let formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

function convertAndFormatDate(dateString) {
  // Convertir el string a un objeto Date
  const date = new Date(dateString);

  // Verificar si la conversión fue exitosa
  if (isNaN(date)) {
    return "Fecha no válida";
  }

  // Extraer el día, el mes y el año de la fecha
  let day = date.getDate();
  let month = date.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
  let year = date.getFullYear();

  // Asegurarse de que el día y el mes tengan dos dígitos
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // Construir la cadena con el formato dd-mm-yyyy
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

function ahora() {
  const ahora = new Date();

  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const day = String(ahora.getDate()).padStart(2, "0");

  const hours = String(ahora.getHours()).padStart(2, "0");
  const minutes = String(ahora.getMinutes()).padStart(2, "0");
  const seconds = String(ahora.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function logout() {
  sessionStorage.removeItem("usuario_autenticado");
  sessionStorage.removeItem("cliente_info");
  sessionStorage.removeItem("cuenta");
  //redirigir al loguin
  window.location.href = 'loguin.html';
}
