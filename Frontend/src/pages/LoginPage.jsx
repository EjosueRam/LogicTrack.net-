import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateFields = () => {
        let valid = true;
        if (!email.includes('@')) {
            setEmailError('Por favor, introduce un correo electrónico válido.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            return;
        }
        try {
            const response = await axios.post('https://localhost:5001/api/Login', { username: email, password });
            console.log(response.data.user); // Verifica la estructura del objeto user
            login({
                first_name: response.data.user.firstName,
                last_name: response.data.user.lastName,
                // otras propiedades del usuario
            });
            navigate('/ScannerPage');
        } catch (error) {
            console.error('Error logging in:', error);
            setEmailError('Error en el inicio de sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <div style={{ backgroundColor: '#1D355E' }} className="flex items-center justify-center min-h-screen w-screen">
            <div className="bg-white p-20 md:p-18 rounded-xl shadow-lg flex w-full max-w-3xl">
                <div className="flex-shrink-0 p-6">
                    <img src="/IVC-logo.png" alt="Logo" className="w-50 md:w-52 h-auto max-h-50 md:max-h-52" />
                </div>
                <div className="ml-6 flex-grow">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Contraseña:</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;