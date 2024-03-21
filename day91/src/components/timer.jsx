import React, { useState, useEffect } from 'react';
import '../css/radialtimer.css';

export default function RadialTimer({ onTimerUpdate }) {
  const [seconds, setSeconds] = useState(60);
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const newIntervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
      setProgress(prevProgress => prevProgress + (360 / seconds));
    }, 1000);
    setIntervalId(newIntervalId);
    return () => clearInterval(newIntervalId);
  }, [seconds]);

  useEffect(() => {
    if (count >= seconds) {
      clearInterval(intervalId);
      return;
    }
    // Send remaining time to parent component
    onTimerUpdate(remainingSeconds);
  }, [count, seconds, intervalId, onTimerUpdate]);

  const remainingSeconds = Math.max(0, seconds - count);

  return (
    <div className="radialtimer" id="timer">
      <div className="n">{remainingSeconds}</div>
      <div className="slice">
        <div className="pie r" style={{ transform: `rotate(${progress}deg)` }}></div>
        <div className="pie l"></div>
      </div>
    </div>
  );
}
