import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserDropdown = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                <span className="text-gray-600">{user?.first_name} {user?.last_name}</span>
                <img className="w-8 h-8 rounded-full" src="/profile.png" alt="User profile" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;