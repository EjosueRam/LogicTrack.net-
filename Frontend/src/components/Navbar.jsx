import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserDropdown from './UserDropdown.jsx';

const Navbar = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow w-full z-50 h-12 flex items-center">
            <div className="container mx-auto px-4 flex justify-end items-center">
                <ul className="flex items-center space-x-4">
                    {isAuthenticated && <UserDropdown />}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;