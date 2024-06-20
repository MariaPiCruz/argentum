function formatDate(date) {
    // Extraer el día, el mes y el año de la fecha proporcionada
    let day = date.getDate();
    let month = date.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
    let year = date.getFullYear();

    // Asegurarse de que el día y el mes tengan dos dígitos
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
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
        return 'Fecha no válida';
    }

    // Extraer el día, el mes y el año de la fecha
    let day = date.getDate();
    let month = date.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
    let year = date.getFullYear();

    // Asegurarse de que el día y el mes tengan dos dígitos
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    // Construir la cadena con el formato dd-mm-yyyy
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}