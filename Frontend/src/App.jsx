import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage.jsx';
import { ScannerFormPage } from './pages/ScannerFormPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import { SalesFormPage } from './pages/SalesFormPage.jsx';
import { Navigation } from './components/Navigation.jsx';
import { Toaster } from "react-hot-toast";
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthContext } from './context/AuthContext.jsx';
import HuGeneratedPage from './pages/HuGeneratedPage.jsx';
import  {HuGeneratedForm}  from './pages/HuGeneratedForm.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import FileUploadPage from './pages/FileUploadPage.jsx';
import { getHuInternals } from './api/FileUpload.api.js';
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);
    const [huInternalsState, setHuInternalsState] = useState([]);

    useEffect(() => {
        // Cargar datos desde el backend cuando el componente se monta
        const fetchHuInternals = async () => {
            try {
                const response = await getHuInternals();
                setHuInternalsState(response.data.huInternals || []);
            } catch (error) {
                console.error('Error fetching HU internals:', error);
            }
        };

        fetchHuInternals();
    }, []);

    const containsId = (pathname) => {
        const idPattern = /\/\d+$/; // Patrón para detectar un ID al final de la ruta
        return idPattern.test(pathname);
    };
// show of the entires of routes of the main app
    return (
        <div className="flex h-screen">
            {location.pathname !== '/login' && !containsId(location.pathname) && <Navigation />}
            <div className="flex flex-col flex-12 w-full overflow-hidden">
                {isAuthenticated && location.pathname !== '/login' && <Navbar />}
                <div className={`flex-1 overflow-auto ${isAuthenticated && location.pathname !== '/login' ? 'pt-14' : ''}`}>
                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/' element={<Navigate to='/login' />} />
                        <Route
                            path='/ScannerPage'
                            element={
                                <ProtectedRoute>
                                    <ScannerPage huInternalsState={huInternalsState} setHuInternalsState={setHuInternalsState} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/Search-Hu'
                            element={
                                <ProtectedRoute>
                                    <ScannerFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/Search-Hu/:id'
                            element={
                                <ProtectedRoute>
                                    <ScannerPage huInternalsState={huInternalsState} setHuInternalsState={setHuInternalsState} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/SalesPage'
                            element={
                                <ProtectedRoute>
                                    <SalesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/Sales-list'
                            element={
                                <ProtectedRoute>
                                    <SalesFormPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/Sales-list/:id'
                            element={
                                <ProtectedRoute>
                                    <SalesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/HuGenerated'
                            element={
                                <ProtectedRoute>
                                    <HuGeneratedPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/HuGenerated/:id'
                            element={
                                <ProtectedRoute>
                                    <HuGeneratedPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/HuGenerated-form'
                            element={
                                <ProtectedRoute>
                                    <HuGeneratedForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/FileUploadPage'
                            element={
                                <ProtectedRoute>
                                    <FileUploadPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
                <Footer className="bg-gray-100 text-center text-sm p-4" />
            </div>
            <Toaster />
        </div>
    );
}

export default App;