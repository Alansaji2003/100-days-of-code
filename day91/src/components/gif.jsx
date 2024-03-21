
import React from 'react';
import { Link } from 'react-router-dom';

export default function Gif() {
  return (
    <div className="go-gif">
      <Link to="/quiz">
        <img className="arrow" src="images/giphy.gif" alt="Arrow" />
        <h2 style={{color:'black', fontSize:'2rem'}}>Click to go to Quiz</h2>
      </Link>
    </div>
  );
}
