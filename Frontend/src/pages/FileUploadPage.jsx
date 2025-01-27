import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { extractAndCompareFile, saveHuInternals, getHuInternals} from '../api/FileUpload.api.js';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import $ from 'jquery'

DataTable.use(DT);

const FileUploadPage = ({ scannedHuInternals = [] }) => {
    const [file, setFile] = useState(null);
    const [huInternalsState, setHuInternalsState] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Extraer y comparar datos del archivo
            const response = await extractAndCompareFile(file);
            if (response.status === 200) {
                toast.success('Archivo procesado con éxito');
                const huInternals = response.data.huInternals || [];
                console.log  (huInternals);
                // Guardar los datos extraídos
                await saveHuInternals(huInternals);
                setHuInternalsState(huInternals);
            } else {
                toast.error(response.data.error || 'Error al procesar el archivo');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al procesar el archivo');
        }
    };

    useEffect(() => {
        // Cargar datos desde el backend cuando el componente se monta
        const fetchHuInternals = async () => {
            try {
                const response = await getHuInternals();
                setHuInternalsState(response.data.huInternals || []);
            } catch (error) {
                console.error('Error fetching HU internals:', error);
            }
        };

        fetchHuInternals();
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <div className="bg white min-h-screen w-full">
            <h1 className="text-2xl font-bold mb-4 w-full">Subir Archivo Excel</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Subir Archivo
                </button>
            </form>
            <DataTable
                data={huInternalsState}
                columns={[
                    { title: 'HU', data: 'huInternal' },
                    {
                        title: 'Estado',
                        data: 'status',
                        render: (data) => {
                            const className = data === 'Ingreso a 2da revisión' ? 'text-green-600' : 'text-red-500';
                            return `<span class="${className}">${data}</span>`;
                        }
                    }
                ]}
                className="display"
            />
        </div>
    );
};

export default FileUploadPage;
