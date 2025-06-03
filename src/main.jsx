window.onerror = function (message, source, lineno, colno, error) {
    alert('Error: ' + message + '\nLine: ' + lineno);
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
