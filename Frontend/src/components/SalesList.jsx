import { useEffect, useState, useMemo } from "react";
import { getAllSales } from "../api/Sales.api.js";
import { SalesCards } from "./SalesCard.jsx";
import { animateScroll as scroll } from 'react-scroll';
import ReactPaginate from 'react-paginate';

export function SalesList() {
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [huSearch, setHuSearch] = useState(''); // Estado para HU
    const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual
    const [showScrollButton, setShowScrollButton] = useState(false); // Estado para mostrar el botón de scroll
    const [loading, setLoading] = useState(true); // Estado de carga
    const [itemsPerPage] = useState(10); // Número de elementos por página

    useEffect(() => {
        async function loadSales() {
            setLoading(true); // Iniciar carga
            const res = await getAllSales();
            const sortedData = res.data.sort((a, b) => new Date(b.Date_time) - new Date(a.Date_time));
            setSales(sortedData);
            setFilteredSales(sortedData);

            // Establece la página actual al mes más reciente
            const mostRecentMonthYear = new Date(sortedData[0].Date_time).toLocaleString('default', { month: 'long', year: 'numeric' });
            const monthYears = Object.keys(scansByMonthYear(sortedData));
            setCurrentPage(monthYears.indexOf(mostRecentMonthYear));
            setLoading(false); // Finalizar carga
        }
        loadSales();

        // Agregar un event listener para mostrar el botón de scroll
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Función para buscar por HU
    const handleSearchByHu = () => {
        const filteredByHu = sales.filter((sale) => {
            const hu = sale.HandlingUnit ? sale.HandlingUnit.toLowerCase() : '';
            const search = huSearch.toLowerCase();
            return hu.includes(search) || hu.endsWith(search);
        });
        setFilteredSales(filteredByHu);
    };

    // Función para agrupar las ventas por mes y año
    const scansByMonthYear = (scans) => {
        return scans.reduce((acc, scanItem) => {
            const monthYear = new Date(scanItem.Date_time).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(scanItem);
            return acc;
        }, {});
    };

    const monthYears = useMemo(() => Object.keys(scansByMonthYear(filteredSales)), [filteredSales]);
    const currentSales = useMemo(() => filteredSales.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage), [filteredSales, currentPage, itemsPerPage]);

    // Función para volver al inicio de la página
    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    // Manejar el cambio de página
    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <div className="bg-white max-h-screen w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Buscador separado */}
            <div className="flex justify-center items-center mt-4 w-full max-w-lg">
                <input
                    type="text"
                    placeholder="Buscar por HU"
                    value={huSearch}
                    onChange={(e) => setHuSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearchByHu}
                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out ml-2"
                >
                    🔍
                </button>
            </div>

            {/* Contenedor de las tarjetas */}
            <div className="flex flex-col flex-grow">
                {/* Indicador de carga */}
                {loading ? (
                    <div className="flex justify-center items-center flex-grow">
                        <p>Cargando...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 rounded-lg shadow-lg flex-grow">
                        {currentSales.length > 0 ? (
                            currentSales.map((sale) => (
                                <SalesCards key={sale.id} Sales={sale} />
                            ))
                        ) : (
                            <p>No se encontraron resultados.</p>
                        )}
                    </div>
                )}

                {/* Barra de navegación por meses y años */}
                <div className="flex flex-wrap justify-center mt-4">
                    {monthYears.map((monthYear, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`px-4 py-2 mx-1 rounded ${
                                index === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {monthYear}
                        </button>
                    ))}
                </div>

                {/* Paginación */}
                <div className="flex justify-center mt-4">
                    <ReactPaginate
                        previousLabel={'← Anterior'}
                        nextLabel={'Siguiente →'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(filteredSales.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination flex justify-center space-x-2 mt-4'}
                        activeClassName={'bg-blue-500 text-white'}
                        pageClassName={'px-3 py-1 border rounded'}
                        previousClassName={'px-3 py-1 border rounded'}
                        nextClassName={'px-3 py-1 border rounded'}
                        breakClassName={'px-3 py-1 border rounded'}
                        disabledClassName={'opacity-50 cursor-not-allowed'}
                    />
                </div>
            </div>

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out"
                >
                    ⬆️
                </button>
            )}
        </div>
    );
}