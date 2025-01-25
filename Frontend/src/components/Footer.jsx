import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white-100 text-gray-600 text-center py-4" >
            <div>
                {new Date().getFullYear()}  Copyright © LogicTrack - Industria Vidriera de Coahuila by Softvision Ver. 1.0.0
            </div>
        </footer>
    );
};

export default Footer;