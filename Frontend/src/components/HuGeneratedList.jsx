import React, { useEffect, useState } from "react";
import { getAllHuGenerated } from "../api/Hu_generated.api.js";
import HuGeneratedCard from "./HuGeneratedCard.jsx";
import { animateScroll as scroll } from 'react-scroll';
import ReactPaginate from 'react-paginate';

export function HuGeneratedList() {
    const [huGeneratedList, setHuGeneratedList] = useState([]);
    const [filteredHuGenerated, setFilteredHuGenerated] = useState([]);
    const [huSearch, setHuSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const itemsPerPage = 10; // Número de elementos por página

    useEffect(() => {
        async function loadHuGenerated() {
            const res = await getAllHuGenerated();
            const sortedData = res.data.sort((a, b) => new Date(b.Date_time) - new Date(a.Date_time));
            setHuGeneratedList(sortedData);
            setFilteredHuGenerated(sortedData);

            const mostRecentMonthYear = new Date(sortedData[0].Date_time).toLocaleString('default', { month: 'long', year: 'numeric' });
            const monthYears = Object.keys(groupByMonthYear(sortedData));
            setCurrentPage(monthYears.indexOf(mostRecentMonthYear));
        }
        loadHuGenerated();

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

    const handleSearchByHu = () => {
        const filteredByHu = huGeneratedList.filter((huGenerated) => {
            const hu = huGenerated.HandlingUnit ? huGenerated.HandlingUnit.toLowerCase() : '';
            const search = huSearch.toLowerCase();
            return hu.includes(search) || hu.endsWith(search);
        });
        setFilteredHuGenerated(filteredByHu);
    };

    const groupByMonthYear = (items) => {
        return items.reduce((acc, item) => {
            const monthYear = new Date(item.Date_time).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(item);
            return acc;
        }, {});
    };

    const monthYears = Object.keys(groupByMonthYear(filteredHuGenerated));
    const currentItems = groupByMonthYear(filteredHuGenerated)[monthYears[currentPage]] || [];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    return (
        <div className="w-full overflow-x-auto w-full">
            <div className="flex mb-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Buscar por HU"
                        value={huSearch}
                        onChange={(e) => setHuSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleSearchByHu}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                    >
                        🔍
                    </button>
                </div>
            </div>

            <div className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
                {currentItems.length > 0 ? (
                    currentItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((huGenerated) => (
                        <HuGeneratedCard key={huGenerated.id} huGenerated={huGenerated} />
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>

            <ReactPaginate
                previousLabel={'← Anterior'}
                nextLabel={'Siguiente →'}
                pageCount={Math.ceil(currentItems.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName={'flex justify-center mt-4'}
                pageClassName={'mx-1'}
                pageLinkClassName={'px-3 py-1 border rounded hover:bg-blue-500 hover:text-white'}
                previousLinkClassName={'px-4 py-2 border rounded hover:bg-blue-500 hover:text-white'}
                nextLinkClassName={'px-3 py-1 border rounded hover:bg-blue-500 hover:text-white'}
                activeLinkClassName={'bg-blue-500 text-white'}
                disabledLinkClassName={'text-gray-400 cursor-not-allowed'}
            />

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