import axios from 'axios';

// Instancia para la extracción y comparación de datos en scanner
const scannerApi = axios.create({
    baseURL: 'https://localhost:5001/api/UploadFile/',
});

// Instancia para el guardado y visualización de datos en FileUpload
const fileUploadApi = axios.create({
    baseURL: 'https://localhost:5001/api/UploadExcel/',
});

// Función para subir el archivo y extraer datos
export const extractAndCompareFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return scannerApi.post('/', formData);
};

// Función para guardar los datos extraídos
export const saveHuInternals = (huInternals) => {
    const formattedData = huInternals.map(hu => ({ hu_internal: hu,status: 'Pendiente' }));
    return fileUploadApi.post('/', { huInternals: formattedData });
};

// Función para obtener los datos guardados
export const getHuInternals = () => {
    return fileUploadApi.get('/');
};

// Función para actualizar el estado de los HUInternals
export const updateHuInternalsStatus = (huInternals) => {
    return fileUploadApi.put('/', { huInternals });
};