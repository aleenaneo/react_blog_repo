import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('cm_nb_ra_bg_root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
