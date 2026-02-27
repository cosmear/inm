import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import axios from 'axios'
import './index.css'

// Set the base URL for all axios requests from the environment variable
// This is critical for deployment on Hostinger where the backend URL might differ from the frontend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
