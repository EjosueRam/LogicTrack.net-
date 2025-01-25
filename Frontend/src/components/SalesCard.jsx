import React from 'react';

export function SalesCards({ Sales }) {
    return (
        <div
            className="w-full bg-white p-4 hover:bg-indigo-50 transition duration-200 ease-in-out cursor-pointer flex items-center border-b last:border-none border-gray-200"
            onClick={() => {}}
        >
            <div className="w-full flex flex-wrap justify-between items-center text-sm">
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Fecha y Hora:</p>
                    <p className="text-gray-800">{Sales.Date_time}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Escaneo:</p>
                    <p className="text-gray-800">{Sales.Sales}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Hu:</p>
                    <p className="text-gray-800">{Sales.HandlingUnit}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Material:</p>
                    <p className="text-gray-800">{Sales.Material}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Presentacion:</p>
                    <p className="text-gray-800">{Sales.Presentation}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Colaborador:</p>
                    <p className="text-gray-800">{Sales.Coworker}</p>
                </div>
            </div>
        </div>
    );
}