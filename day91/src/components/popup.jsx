import React, { useState } from 'react';
import '../css/popup.css'; // Import your CSS file with styles

export default function Popup({gameOver,points}) {

    const handleReload = () =>{
        window.location.reload();
    }
    

    return( gameOver &&
        <>
        <div className="popup">
        <div className="popup-content">
        <h2>GAME OVER!</h2>
        <h3>You Got {points}/20 points</h3>
        <button onClick={handleReload}>Retry</button>
        </div>
        </div>
        </>

    )
}