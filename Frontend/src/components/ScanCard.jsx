import { useNavigate } from "react-router-dom";

export function ScanCard({ scanItem }) {
    const navigate = useNavigate();

    return (
        <div
            className="w-full bg-white p-4 hover:bg-indigo-50 transition duration-200 ease-in-out cursor-pointer flex items-center border-b last:border-none border-gray-200"
            onClick={() => {
                navigate(`/Search-Hu/${scanItem.id}`);
            }}
        >
            <div className="w-full flex flex-wrap justify-between items-center text-sm">
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Fecha y Hora:</p>
                    <p className="text-gray-800">{scanItem.date_hour}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Escaneo:</p>
                    <p className="text-gray-800">{scanItem.escaneo}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Hu:</p>
                    <p className="text-gray-800">{scanItem.hu}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Línea:</p>
                    <p className="text-gray-800">{scanItem.linea}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Motivo:</p>
                    <p className="text-gray-800">{scanItem.motivo}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Carril:</p>
                    <p className="text-gray-800">{scanItem.carril}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Procedencia:</p>
                    <p className="text-gray-800">{scanItem.procedencia}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Submotivo:</p>
                    <p className="text-gray-800">{scanItem.submotivo}</p>
                </div>
                <div className="flex-1 px-2 py-1">
                    <p className="text-gray-500 font-semibold">Colaborador:</p>
                    <p className="text-gray-800">{scanItem.colaborador}</p>
                </div>
            </div>
        </div>
    );
}