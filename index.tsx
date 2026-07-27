import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

console.log("App initialization started...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Error: Root element not found");
  throw new Error("Could not find root element");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log("App rendered successfully");