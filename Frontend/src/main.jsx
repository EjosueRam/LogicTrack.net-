import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import ReactDOM from "react-dom/client";
import './index.css'
import {AuthProvider} from "./context/AuthContext.jsx";
import App from './App.jsx'
import '../src/App.css'


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <AuthProvider>
        <Router>
            <App/>
        </Router>
    </AuthProvider>
);
