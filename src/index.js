import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // ← your custom CSS
import './index.css'; // ✅ This is correct
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);