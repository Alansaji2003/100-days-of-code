import React, { useState, useEffect } from 'react';
import quiz from "../quiz";
import RadialTimer from "./timer";
import Popup from './popup';

export default function QuizPage() {
 
  const [marked, setMarked] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Function to shuffle options
  const shuffleOptions = (options) => {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Shuffle options when a new question is displayed
    setShuffledOptions(shuffleOptions([
      quiz[currentQuestionIndex].correct_answer,
      ...quiz[currentQuestionIndex].incorrect_answers
    ]));
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (!gameOver) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setMarked(false);
    }
  };

  const handleOptionClick = (answer) => {
    if (!gameOver && !marked) {
      setMarked(true);
      setSelectedOption(answer);
      if (answer === quiz[currentQuestionIndex].correct_answer) {
        setPoints(prevPoints => prevPoints + 1);
      }
    }
  };

  const getOptionStyle = (option) => {
    if (!gameOver) {
      if (option === selectedOption) {
        return option === quiz[currentQuestionIndex].correct_answer ? { backgroundColor: '#8dfe02' } : { backgroundColor: '#ff0000' };
      }
      return {};
    }
  };

  const recieveTime = (seconds) => {
    if (seconds <= 1 || currentQuestionIndex === quiz.length - 1) {
      setGameOver(true);
    }
  };

  return (
    <>
      <Popup gameOver={gameOver} points={points}/>
      <div className="quiz-page">
        <h1 style={{position:'absolute', top:'2%', color:'white'}} >Get maximum number of questions correct in 60 seconds!!</h1>
        <div className="card">
          <div className="row">
            <h2>{quiz[currentQuestionIndex].question}</h2>
          </div>
          <div className="options">
            {shuffledOptions.map((option, i) => (
              <h3 style={getOptionStyle(option)} onClick={() => handleOptionClick(option)} key={i}>{option}</h3>
            ))}
          </div>
        </div>
        <RadialTimer onTimerUpdate={recieveTime}/>
        <div className="navigation-buttons">
          {currentQuestionIndex < quiz.length - 1 && (
            <NextButton onNext={handleNextQuestion} />
          )}
        </div>
        <Points point={points}/>
      </div>
    </>
  );
}

const NextButton = ({ onNext }) => {
  return (
    <button style={{position:'absolute',top:'85%', left:'47%'}}  className="button-17" role="button" onClick={onNext}>
      Next
    </button>
  );
};

function Points(prop){
  return (
    <h1 style={{position:'absolute', top:'30%', left:'80%'}}>Your Points : {prop.point}</h1>
  )
}
