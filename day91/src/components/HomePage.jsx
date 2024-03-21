import React from 'react';
import Heading from "./heading";
import Gif from "./gif";

export default function HomePage({ onPlayAudio }) {
  const handleGifClick = () => {
    // Call the function passed from the parent (App.jsx) to play audio
    onPlayAudio();
  };

  return (
    <>
      <Heading />
      <Gif onClick={handleGifClick} />
    </>
  );
}
