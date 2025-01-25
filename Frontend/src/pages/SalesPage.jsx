import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { makeSales } from "../api/Sales.api.js";
import { getHuInternals } from "../api/FileUpload.api.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import getUserFullName from "@/components/UserInfo.jsx";


DataTable.use(DT);

const SalesPage = () => {
    const [scanText, setScanText] = useState(""); // Campo de texto para escaneos
    const [allScans, setAllScans] = useState([]); // Guardar todos los escaneos
    const [huInternals, setHuInternals] = useState([]); // Guardar HUInternals desde el backend
    const [matchingHuInternals, setMatchingHuInternals] = useState([]); // Guardar coincidencias
    const [showTable, setShowTable] = useState(false); // Mostrar tabla de coincidencias
    const userFullName = getUserFullName();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        // Cargar HUInternals desde el backend cuando el componente se monta
        const fetchHuInternals = async () => {
            try {
                const response = await getHuInternals();
                setHuInternals(response.data.huInternals || []);
            } catch (error) {
                console.error('Error fetching HU internals:', error);
            }
        };

        fetchHuInternals();
    }, []);

    // Extrae los primeros 20 dígitos de cada escaneo válido
    const extractFirst20Digits = (text) => {
        const scans = text.split('\n').filter(scan => scan.trim() !== '');  // Separa por saltos de línea
        return scans.map(scan => scan.slice(0, 20));  // Extrae los primeros 20 caracteres
    };

    // Función que maneja la entrada del escaneo
    const handleScanInput = (e) => {
        const newScan = e.target.value;
        const lastScan = newScan.split('\n').pop().trim(); // Extrae el último escaneo ingresado

        // Si el escaneo tiene la longitud correcta (66, 68, 69 o 20 caracteres)
        if ([66, 68, 69].includes(lastScan.length)) {
            setAllScans(prevScans => {
                if (!prevScans.includes(lastScan)) {
                    return [...prevScans, lastScan];
                }
                return prevScans;
            });
            setScanText(""); // Limpia el campo de texto
        } else {
            setScanText(newScan); // Actualiza el texto del textarea
        }
    };

    // Función que maneja el guardado y descarga del archivo de texto
    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        const validScans = allScans.map(scan => ({
            Sales: scan,
            HandlingUnit: scan.slice(0, 20),  // Asume que el HandlingUnit son los primeros 20 caracteres
            Material: scan.slice(29, 39),     // Asume que el material está en esta posición
            Coworker: userFullName
        }));

        if (validScans.length === 0) {
            toast.error("Por favor, llena al menos un escaneo.", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            setIsSaving(false);
            return;
        }

        // Buscar coincidencias entre HandlingUnit y HUInternals
        const matchingHUs = validScans.filter(scan =>
            huInternals.some(hu => hu.hu_internal === scan.HandlingUnit)
        );

        if (matchingHUs.length > 0) {
            setMatchingHuInternals(matchingHUs);
            setShowTable(true);
            setIsSaving(false);
            return;
        }
        try {
            await saveScans(validScans);
        } catch (error) {
            console.error("Error en handleSave:", error);
            toast.error("Error al guardar escaneos.", {
                position: "bottom-right",
                style: {background: "#101010", color: "#fff"},
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Función para guardar los escaneos y descargar el archivo
    const saveScans = async (validScans) => {
        try {
            // Crear nuevos registros de escaneos
            await Promise.all(validScans.map((scan) => makeSales(scan)));
            toast.success("Escaneos guardados", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                },
            });

            // Crear y descargar el archivo de texto
            const extractedScans = extractFirst20Digits(allScans.join('\n'));
            const apartados = matchingHuInternals.map(hu => `Apartado: ${hu.HandlingUnit}`);
            const normales = extractedScans.filter(scan => !matchingHuInternals.some(hu => hu.HandlingUnit === scan));
            const blob = new Blob([apartados.join('\n'), '\n', normales.join('\n')], {type: "text/plain"});
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "scans.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            navigate("/Sales-list"); // Redirige después de guardar
        } catch (error) {
            console.error("Error al guardar los escaneos:", error); // Depuración
            toast.error("Hubo un error al guardar los escaneos", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"},
            });
        }
    };

    // Función para descargar el archivo de texto sin guardar en el backend
    const handleExtract = () => {
        const extractedScans2 = extractFirst20Digits(allScans.join('\n'));
        const blob = new Blob([extractedScans2.join('\n')], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "scans.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white min-h-screen w-full">
            <div className="w-full py-10">
                <form className="bg-white p-4 w-full max-w-full">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coworkerSelect">
                            Colaborador:
                        </label>
                        <input
                            type="text"
                            id="coworkerSelect"
                            value={userFullName}
                            readOnly
                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scanText">
                            Escaneos (un escaneo por línea):
                        </label>
                        <textarea
                            id="scanText"
                            value={scanText}
                            onChange={handleScanInput}
                            placeholder="Introduce los escaneos aquí..."
                            className="border p-4 w-full h-64 focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={handleExtract}
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Extraer
                    </button>
                </form>
                {showTable && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Coincidencias encontradas:</h2>
                        <DataTable
                            data={matchingHuInternals}
                            columns={[
                                { title: 'HUInternal', data: 'HandlingUnit' },
                                { title: 'Estado', data: 'status', render: (data) => data === 'Ingreso a 2da revisión' ? '<span class="text-green-500">Ingreso a 2a revisión</span>' : '<span class="text-red-500">Pendiente</span>' }
                            ]}
                            className="display"
                            paging={true}
                            pageLength={10}
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                setShowTable(false);
                                await saveScans(allScans.map(scan => ({
                                    Sales: scan,
                                    HandlingUnit: scan.slice(0, 20),
                                    Material: scan.slice(29, 39),
                                    Coworker: userFullName
                                })));
                            }}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesPage;