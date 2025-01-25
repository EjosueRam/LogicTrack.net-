import React, { useState, useEffect } from 'react';

const EditableTable = ({ defectosEmpaque }) => {
    const [defectos, setDefectos] = useState(defectosEmpaque || []);

    useEffect(() => {
        setDefectos(defectosEmpaque || []);
    }, [defectosEmpaque]);

    const handleMarkAsReviewed = (hu) => {
        const updatedDefectos = defectos.filter(defecto => defecto.hu !== hu);
        setDefectos(updatedDefectos);
    };

    const groupByHorno = (defectos = []) => {
        const grouped = {
            H1: [],
            H2: [],
            H3: [],
            H4: [],
            H5: []
        };

        defectos.forEach(defecto => {
            const linea = defecto.linea;
            if (['11', '12', '13'].includes(linea)) {
                grouped.H1.push(defecto);
            } else if (['21', '22', '23', '24'].includes(linea)) {
                grouped.H2.push(defecto);
            } else if (['31', '32', '33', '34'].includes(linea)) {
                grouped.H3.push(defecto);
            } else if (['41', '42', '43'].includes(linea)) {
                grouped.H4.push(defecto);
            } else if (['51', '52', '53'].includes(linea)) {
                grouped.H5.push(defecto);
            }
        });

        return grouped;
    };

    const groupedDefectos = groupByHorno(defectos);

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Defectos de Empaque</h2>
            {Object.keys(groupedDefectos).map(horno => (
                <div key={horno} className="mb-4">
                    <h3 className="text-md font-semibold mb-2">{horno}</h3>
                    <table className="table-auto w-full mb-4">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                HU
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Línea
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Submotivo
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Revisado
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupedDefectos[horno].map(defecto => (
                            <tr key={defecto.hu}>
                                <td className="px-4 py-2 border-b">{defecto.hu}</td>
                                <td className="px-4 py-2 border-b">{defecto.linea}</td>
                                <td className="px-4 py-2 border-b">{defecto.submotivo}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => handleMarkAsReviewed(defecto.hu)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                    >
                                        ✔
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default EditableTable;