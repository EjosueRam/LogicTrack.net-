import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ScanChart({ filteredData }) {
    const [produccionTotal, setProduccionTotal] = useState(''); // Estado para la producción total ingresada

    // Agrupar los escaneos por fecha y procedencia
    const groupedData = filteredData.reduce((acc, scan) => {
        const date = new Date(scan.date_hour).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { Envolvedora: 0, ASRS: 0, Apartado: 0 };
        }
        if (scan.procedencia === 'Envolvedora') {
            acc[date].Envolvedora++;
        } else if (scan.procedencia === 'ASRS') {
            acc[date].ASRS++;
        } else if (scan.motivo === 'Apartado') {
            acc[date].Apartado++;
        }
        return acc;
    }, {});

    // Total de escaneos para calcular porcentajes
    const totalEscaneos = filteredData.length;

    // Extraer las fechas y los valores para la gráfica
    const dates = Object.keys(groupedData);
    const envolvedoraCounts = dates.map((date) => groupedData[date].Envolvedora);
    const asrsCounts = dates.map((date) => groupedData[date].ASRS);
    const apartadoCounts = dates.map((date) => groupedData[date].Apartado);

    // Calcular porcentajes si se ingresó la producción total
    const envolvedoraPercentage = produccionTotal ? ((envolvedoraCounts.reduce((a, b) => a + b, 0) / produccionTotal) * 100).toFixed(2) : 0;
    const asrsPercentage = produccionTotal ? ((asrsCounts.reduce((a, b) => a + b, 0) / produccionTotal) * 100).toFixed(2) : 0;
    const apartadoPercentage = produccionTotal ? ((apartadoCounts.reduce((a, b) => a + b, 0) / produccionTotal) * 100).toFixed(2) : 0;

    // Calcular el porcentaje de escaneos respecto a la producción total ingresada
    const totalEscaneosPercentage = produccionTotal ? ((totalEscaneos / produccionTotal) * 100).toFixed(2) : 0;

    // Configurar los datos para el gráfico de barras
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Envolvedora (Cantidad)',
                data: envolvedoraCounts,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1,
            },
            {
                label: 'ASRS (Cantidad)',
                data: asrsCounts,
                backgroundColor: '#2ecc71',
                borderColor: '#2dc81d',
                borderWidth: 1,
            },
            {
                label: 'Apartado (Cantidad)',
                data: apartadoCounts,
                backgroundColor: '#dc0e15',
                borderColor: '#c0392b',
                borderWidth: 1,
            },
        ],
    };

    // Opciones del gráfico
    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Cantidad de escaneos',
                },
                beginAtZero: true,
            },
        },
    };

    // Agrupación de escaneos por líneas y hornos
    const hornosData = filteredData.reduce(
        (acc, scan) => {
            const linea = parseInt(scan.linea);
            if (linea >= 11 && linea <= 13) {
                acc.horno1++;
            } else if (linea >= 21 && linea <= 24) {
                acc.horno2++;
            } else if (linea >= 31 && linea <= 34) {
                acc.horno3++;
            } else if (linea >= 41 && linea <= 43) {
                acc.horno4++;
            } else if (linea >= 51 && linea <= 53) {
                acc.horno5++;
            }
            return acc;
        },
        { horno1: 0, horno2: 0, horno3: 0, horno4: 0, horno5: 0 }
    );

    // Agrupación por motivos (Excepción, Retrabajo Pal10, Retrabajo Pal54, 2da Revisión)
    const motivosData = filteredData.reduce(
        (acc, scan) => {
            if (scan.motivo === 'Excepcion') {
                acc.excepcion++;
            } else if (scan.motivo === 'Retrabajo Pal10') {
                acc.retrabajoPal10++;
            } else if (scan.motivo === 'Retrabajo Pal54') {
                acc.retrabajoPal54++;
            } else if (scan.motivo === '2da Revision') {
                acc.segundaRevision++;
            }
            return acc;
        },
        { excepcion: 0, retrabajoPal10: 0, retrabajoPal54: 0, segundaRevision: 0 }
    );

    return (
        <div>
            <h2 className="text-center text-lg font-semibold mb-4">Gráfica de Escaneos por Fecha</h2>

            {/* Input para ingresar la producción total */}
            <div className="mb-4">
                <label htmlFor="produccionTotal" className="block text-center">
                    Ingrese la Producción Total (opcional):
                </label>
                <input
                    type="number"
                    id="produccionTotal"
                    className="border p-2 w-full text-center"
                    placeholder="Producción Total"
                    value={produccionTotal}
                    onChange={(e) => setProduccionTotal(e.target.value)}
                />
            </div>

            {/* Mostrar el porcentaje de la producción total escaneada y por procedencia */}
            {produccionTotal && (
                <div className="mt-4 bg-gray-100 p-4 rounded shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-2">Resumen de Producción</h3>
                    <p className="text-center">
                        Porcentaje de la Producción Total Escaneada: <strong>{totalEscaneosPercentage}%</strong>
                    </p>
                    <p className="text-center">
                        Envolvedora: <strong>{envolvedoraPercentage}%</strong>
                    </p>
                    <p className="text-center">
                        ASRS: <strong>{asrsPercentage}%</strong>
                    </p>
                    <p className="text-center">
                        Apartado: <strong>{apartadoPercentage}%</strong>
                    </p>
                </div>
            )}

            {/* Gráfico de Barras */}
            <Bar data={data} options={options} />

            {/* Tabla de Hornos */}
            <div className="mt-8">
                <h2 className="text-center text-lg font-semibold mb-4">Resumen de Escaneos por Horno</h2>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">Horno</th>
                        <th className="px-4 py-2 border">Cantidad de Escaneos</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-4 py-2 border">Horno 1 (Líneas 11-13)</td>
                        <td className="px-4 py-2 border">{hornosData.horno1}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Horno 2 (Líneas 21-24)</td>
                        <td className="px-4 py-2 border">{hornosData.horno2}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Horno 3 (Líneas 31-34)</td>
                        <td className="px-4 py-2 border">{hornosData.horno3}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Horno 4 (Líneas 41-43)</td>
                        <td className="px-4 py-2 border">{hornosData.horno4}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Horno 5 (Líneas 51-53)</td>
                        <td className="px-4 py-2 border">{hornosData.horno5}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Tabla de Motivos */}
            <div className="mt-8">
                <h2 className="text-center text-lg font-semibold mb-4">Ingresos por Motivos</h2>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">Motivo</th>
                        <th className="px-4 py-2 border">Cantidad</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-4 py-2 border">Excepción</td>
                        <td className="px-4 py-2 border">{motivosData.excepcion}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Retrabajo Pal10</td>
                        <td className="px-4 py-2 border">{motivosData.retrabajoPal10}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">Retrabajo Pal54</td>
                        <td className="px-4 py-2 border">{motivosData.retrabajoPal54}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 border">2da Revisión</td>
                        <td className="px-4 py-2 border">{motivosData.segundaRevision}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
