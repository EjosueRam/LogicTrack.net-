import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getScan, makeScan, updateScan, deleteScan } from '../api/Scan.api.js';
import HuTable from "../components/HuTable.jsx";
import { updateHuInternalsStatus } from "../api/FileUpload.api.js";
import getUserFullName from '../components/UserInfo.jsx'

const ScannerPage = ({ huInternalsState, setHuInternalsState }) => {
    const { formState: { errors }, register, setValue } = useForm();
    const [rows, setRows] = useState([{
        id: Date.now(),
        date_hour: '',
        escaneo: '',
        hu: '',
        linea: '',
        material: '',
        motivo: '',
        submotivo: '',
        procedencia: '',
        date_hu: "",
        carril: '',
        comentarios: '',
        colaborador: ''
    }]);
    const [searchHus, setSearchHus] = useState([]);
    const userFullName = getUserFullName();
    const LENGTH_69 = 69;
    const LENGTH_68 = 68;
    const LENGTH_66 = 66;
    const LENGTH_70 =70;
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const params = useParams();

    function extractData(dataMatrix) {
        const length = dataMatrix.length;
        if (length === LENGTH_69) {
            return {
                hu: dataMatrix.slice(0, 20),
                linea: dataMatrix.slice(4, 6),
                material: dataMatrix.slice(29, 39),
                date_hu: dataMatrix.slice(61, 69)
            };
        } else if (length === LENGTH_68) {
            return {
                hu: dataMatrix.slice(0, 20),
                linea: dataMatrix.slice(4, 6),
                material: dataMatrix.slice(29, 39),
                date_hu: dataMatrix.slice(61, 68)
            };
        } else if (length === LENGTH_66) {
            return {
                hu: dataMatrix.slice(0, 20),
                linea: dataMatrix.slice(4, 6),
                material: dataMatrix.slice(29, 39),
                date_hu: dataMatrix.slice(58, 66)
            };
        } else if (length === LENGTH_70) {
            return {
                hu: dataMatrix.slice(0, 20),
                linea: dataMatrix.slice(4, 6),
                material: dataMatrix.slice(29, 39),
                date_hu: dataMatrix.slice(66, 70)
            };
        } else {
            console.error('error longitud no valida');
            return {};
        }
    }

    const handleEscaneoChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].escaneo = value;

        const scannedHuInternal = value.split(',')[0];

        if (value.length === LENGTH_69 || value.length === LENGTH_68 || value.length === LENGTH_66 || value.length === LENGTH_70) {
            const { hu, linea, material, date_hu } = extractData(value);
            updatedRows[index].hu = hu;
            updatedRows[index].linea = linea;
            updatedRows[index].material = material;
            updatedRows[index].date_hu = date_hu;

            if (huInternalsState.some(hu => hu.hu_internal === scannedHuInternal)) {
                updatedRows[index].motivo = 'Apartado';
                updatedRows[index].procedencia = 'Almacen Temporal';
                setValue(`rows.${index}.motivo`, 'Apartado');
                setValue(`rows.${index}.procedencia`, 'Almacen General');
                toast.success('Apartado ingresado a 2a revisión', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                });
            }

            const lastRow = updatedRows[updatedRows.length - 1];
            if (lastRow.escaneo !== '' || lastRow.hu !== '' || lastRow.linea !== '' || lastRow.material !== '') {
                updatedRows.push({
                    id: Date.now(),
                    date_hour: '',
                    escaneo: '',
                    hu: '',
                    linea: '',
                    material: '',
                    motivo: '',
                    submotivo: '',
                    procedencia: '',
                    date_hu: "",
                    carril: '',
                    comentarios: '',
                    colaborador: '',
                });
                setTimeout(() => {
                    const lastInput = inputRefs.current[inputRefs.current.length - 1];
                    if (lastInput) {
                        lastInput.focus();
                    }
                }, 0);
            }
        }

        setRows(updatedRows);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        setValue(`rows.${index}.${field}`, value);
    };

    const handleSave = async () => {
        const validRows = rows.filter(row => row.escaneo && row.hu && row.linea && row.material && row.motivo && row.procedencia);

        if (validRows.length === 0) {
            toast.error('Por favor, llena los campos requeridos en al menos una fila.', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
            return;
        }

        try {
            const rowsWithUser = validRows.map(row => ({
                ...row,
                colaborador: userFullName
            }));
            if (params.id) {
                for (const row of rowsWithUser) {
                    await updateScan(params.id, row);
                }
                toast.success('Escaneo actualizado', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                });
            } else {
                for (const row of rowsWithUser) {
                    await makeScan(row);
                }
                toast.success('Escaneo agregado', {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff"
                    }
                });
            }

            const updatedHuInternals = rowsWithUser.map(row => ({
                hu_internal: row.hu,
                status: 'Ingreso a 2da revisión'
            }));
            const response = await updateHuInternalsStatus(updatedHuInternals);
            if (response.data.not_found.length > 0) {
                console.warn('Some HUInternals not found:', response.data.not_found);
            }
            setHuInternalsState(response.data.huInternals);

            navigate('/Search-HU');
        } catch (error) {
            console.error(error);
            toast.error('Hubo un error al guardar los escaneos', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
        }
    };

    useEffect(() => {
        async function loadScan() {
            if (params.id) {
                const { data } = await getScan(params.id);
                setRows([{
                    id: data.id,
                    date_hour: data.date_hour,
                    linea: data.linea,
                    hu: data.hu,
                    material: data.material,
                    motivo: data.motivo,
                    submotivo: data.submotivo,
                    procedencia: data.procedencia,
                    escaneo: data.escaneo,
                    date_hu: data.date_hu,
                    carril: data.carril,
                    comentarios: data.comentarios,
                    colaborador:data.colaborador,
                }]);
            }
        }

        loadScan();
    }, [params.id]);

    const formartTime = (isoDate) => {
        if (!isoDate) {
            const now = new Date();
            const formatedDate = now.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
            const formatedTime = now.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            return `${formatedDate} ${formatedTime}`;
        }
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) {
            return "Fecha no valida";
        }
        const formatedDate = date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
        const formatedTime = date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${formatedDate} ${formatedTime}`;
    };

    const isHighlighted = (hu) => {
        return Array.isArray(searchHus) && searchHus.includes(hu) && hu !== '';
    };

    return (
        <div className="bg-white min-h-screen">
            <HuTable onHuChange={setSearchHus} />
            <div className="w-full py-10">
                <form className="bg-white p-4 w-full max-w-full overflow-auto">
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
                    <table className="table-auto w-full">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Fecha y Hora
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Escaneo
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    HU
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Línea
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Material
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Motivo
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Submotivo
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Procedencia
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Fecha de Hu
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Comentarios
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Carril
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id} className={isHighlighted(row.hu) ? 'bg-yellow-200' : ''}>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={formartTime(row.date_hour)}
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            readOnly
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            value={row.escaneo}
                                            placeholder="Escaneo"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleEscaneoChange(index, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.hu}
                                            placeholder="HU"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'hu', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.linea}
                                            placeholder="Línea"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'linea', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.material}
                                            placeholder="Material"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'material', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            {...register(`rows.${index}.motivo`, {required: 'Motivo es requerido'})}
                                            className={`border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white ${errors.rows?.[index]?.motivo ? 'border-red-500' : ''}`}
                                            onChange={(e) => handleFieldChange(index, 'motivo', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="Apartado">Apartado</option>
                                            <option value="Backtracking">Backtracking</option>
                                            <option value="Bloqueo Pt">Bloqueo Pt</option>
                                            <option value="Sin Hu">Material frente a BT</option>
                                            <option value="Conforme">Conforme</option>
                                            <option value="Defecto de Empaque">Defecto de Empaque</option>
                                            <option value="Desvio de Lgv">Desvio de Lgv</option>
                                            <option value="Desvio manual">Desvio manual</option>
                                            <option value="Envase liso">Envase liso</option>
                                            <option value="Excepcion de sistema">Excepcion de sistema</option>
                                            <option value="Falla de comunicacion">Falla de comunicacion</option>
                                            <option value="Hu duplicada">Hu duplicada</option>
                                            <option value="Impar">Impar</option>
                                            <option value="Rechazo">Rechazo</option>
                                            <option value="Retrabajo Pal10">Retrabajo Pal10</option>
                                            <option value="Retrabajo Pal54">Retrabajo Pal54</option>
                                            <option value="Saldo">Saldo</option>
                                            <option value="Saldo Etiquetado">Saldo Etiquetado</option>
                                            <option value="Sin Hu">Sin Hu</option>
                                            <option value="Venta">Venta</option>
                                        </select>
                                        {errors.rows?.[index]?.motivo &&
                                            <span className="text-red-500">{errors.rows[index].motivo.message}</span>}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.submotivo}
                                            placeholder="Submotivo"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'submotivo', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={row.procedencia}
                                            className={`border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white ${errors.rows?.[index]?.procedencia ? 'border-red-500' : ''}`}
                                            onChange={(e) => handleFieldChange(index, 'procedencia', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="Envolvedora">Envolvedora</option>
                                            <option value="Almacen Temporal">Almacen Temporal</option>
                                            <option value="ASRS">ASRS</option>
                                            <option value="Contingencia">Contingencia</option>
                                            <option value="Bahia 2da Rev">Bahia 2da Rev</option>
                                            <option value="Area de BT">Backtracking</option>
                                        </select>
                                        {errors.rows?.[index]?.procedencia && <span
                                            className="text-red-500">{errors.rows[index].procedencia.message}</span>}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.date_hu}
                                            placeholder="Fecha de Hu"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'dateHu', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={row.comentarios}
                                            placeholder="Comentarios"
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'comentarios', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={row.carril}
                                            className="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300 rounded-md shadow-md bg-white"
                                            onChange={(e) => handleFieldChange(index, 'carril', e.target.value)}
                                        >
                                            <option value=""></option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                            <option value="A3">A3</option>
                                            <option value="A4">A4</option>
                                            <option value="A5">A5</option>
                                            <option value="A6">A6</option>
                                            <option value="A7">A7</option>
                                            <option value="A7">A8</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                        >
                            {params.id ? 'Actualizar' : 'Guardar'}
                        </button>
                        {params.id && (
                            <button
                                onClick={async () => {
                                    const accepted = window.confirm('¿Estás seguro de eliminar este escaneo?');
                                    if (accepted) {
                                        await deleteScan(params.id);
                                        toast.success('Escaneo eliminado', {
                                            position: 'bottom-right'
                                        });
                                        navigate('/Search-Hu');
                                    }
                                }}
                                type="button"
                                className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        )}
                </form>
            </div>
        </div>
);
};

export default ScannerPage;