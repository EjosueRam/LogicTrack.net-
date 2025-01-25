import React,{useState} from 'react';
import {Link} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export function Navigation() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {setIsSidebarOpen(prev => !prev);};
    return (
        <div className="flex h-screen bg-gray-100">
            <div className={`bg-gray-900 text-white transform ${ isSidebarOpen ? 'w-64' : 'w-20' } transition-all duration-300 ease-in-out`}>
                <div className='p-4 flex flex-col items-center'>
                    <button onClick={toggleSidebar} className='text-white focus:outline-none mb-4'><i
                        className={`fas ${isSidebarOpen ? 'fa-arrow-left' : 'fa-bars'}`}></i></button>
                    <h2 className={`text-xl font-semibold mb-8 ${isSidebarOpen ? 'block' : 'hidden'}`}>Menú</h2>
                    <ul className="w-full">
                        <li className="border-b border-gray-700"><Link to="/ScannerPage"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-home"></i>
                            <span
                                className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Inicio-Bahia</span></Link>
                        </li>
                        <li className="border-b border-gray-700"><Link to="/SalesPage"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-tag"></i> <span
                            className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Vender</span> </Link></li>
                        <li className="border-b border-gray-700"><Link to="/Sales-list"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-history"></i> <span
                            className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Vendidas</span> </Link></li>
                        <li className="border-b border-gray-700"><Link to="/Search-Hu"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-chart-bar"></i> <span
                            className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Estadísticas</span> </Link>
                        </li>
                        <li className="border-b border-gray-700"><Link to="/HuGenerated"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-plus-circle"></i> <span
                            className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Registrar Hu Generada</span>
                        </Link></li>
                        <li className="border-b border-gray-700"><Link to="/HuGenerated-form"
                                                                       className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200">
                            <i className="fas fa-cogs"></i> <span
                            className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Hu Generadas</span> </Link>
                        </li>
                        <li className="border-b border-gray-700"> <Link to="/FileUploadPage" className="flex items-center px-4 py-2 hover:bg-gray-800 transition duration-200"> <i className="fas fa-file-upload"></i> <span className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-4`}>Subir Archivo</span> </Link> </li>
                    </ul> </div> </div> </div> ); }


