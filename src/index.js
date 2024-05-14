import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContext } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContext>
    <App />
  </AuthContext>
);