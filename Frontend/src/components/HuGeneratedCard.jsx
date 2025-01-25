import React from "react";
import { useNavigate } from "react-router-dom";

const HuGeneratedCard = ({ huGenerated }) => {
    const navigate = useNavigate();

    return (
        <div
            className="w-full bg-white p-4 hover:bg-indigo-50 transition duration-200 ease-in-out cursor-pointer flex items-center border-b last:border-none border-gray-200"
            onClick={() => navigate(`/HuGenerated/${huGenerated.id}`)}
        >
            <div className="w-full flex flex-wrap justify-between items-center text-sm">
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Fecha y Hora:</p>
                    <p className="text-gray-800">{huGenerated.Date_time}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Hu Generada:</p>
                    <p className="text-gray-800">{huGenerated.huGenerated}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Hu:</p>
                    <p className="text-gray-800">{huGenerated.hu}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Material:</p>
                    <p className="text-gray-800">{huGenerated.material}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Persona:</p>
                    <p className="text-gray-800">{huGenerated.person}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Motivo:</p>
                    <p className="text-gray-800">{huGenerated.reason}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Solicitante:</p>
                    <p className="text-gray-800">{huGenerated.requester}</p>
                </div>
                {huGenerated.huByGenerated && (
                    <div className="flex-1 px-2 py-1">
                        <p className="text-gray-500 font-semibold">Hu por la que se generó:</p>
                        <p className="text-gray-800">{huGenerated.huByGenerated}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HuGeneratedCard;