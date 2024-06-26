import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';      // add this line after installing bootstrap through npm
import { Route, BrowserRouter, Routes } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/*' element={ <App />}/>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);


