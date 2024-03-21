//Creating engaging and interactive educational content
import React from "react";
import { StrictMode } from "react";
import { createRoot} from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import "./css/style.css";

import App from "./components/App.jsx"


const root = createRoot(document.getElementById("root"));

root.render(
    
    <StrictMode>
        <App/>
    </StrictMode>
    
    
)


