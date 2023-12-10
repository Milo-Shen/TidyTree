// Import React Framework
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import CSS
import './index.css';

// Import Component
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);