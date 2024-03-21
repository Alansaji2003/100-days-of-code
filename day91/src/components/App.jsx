import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./HomePage";
import QuizPage from './QuizPage'; 
import backgroundMusic from '../audio/2pac.mp3'; // Import your background music file
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import Button from '@mui/material/Button';

function App() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioElementRef = React.useRef(null);

  // Function to handle playing audio
  const handlePlayAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
      setAudioPlaying(true);
    }
  };

  // Function to handle stopping audio
  const handleStopAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setAudioPlaying(false);
    }
  };

  return (
    <Router>
      <audio ref={audioElementRef} loop>
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    
      <Routes>
        <Route path='/' element={<HomePage onPlayAudio={handlePlayAudio} onStopAudio={handleStopAudio} />} />
        <Route path='/quiz' element={<QuizPage />} />
      </Routes>

      {/* Buttons to manually trigger audio playback and stop */}
      <div style={{ position: 'fixed', bottom: '45%', left: '82%', zIndex: '9999', }}>
        <Button color="success" variant="contained" style={{padding:'5px'}} onClick={handlePlayAudio}><VolumeUpIcon/>Play Music</Button>
        <Button color="error" variant="contained" style={{padding:'5px'}} onClick={handleStopAudio}><VolumeOffIcon/>Stop Music</Button>
      </div>
    </Router>
  );
}

export default App;
