'use client';

import React, { useState } from 'react';
import {motion} from 'framer-motion';

// Flashcard Data
const flashcards = [
  { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces' },
  { id: 2, front: 'What is Tailwind CSS?', back: 'A utility-first CSS framework' },
  { id: 3, front: 'What is JSX?', back: 'A syntax extension for JavaScript used in React' },
  { id: 4, front: 'What is a component in React?', back: 'Reusable building blocks of React applications' },
];

const FlashcardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [flipped, setFlipped] = useState(false);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip(){
    if (!isAnimating){
        setIsFlipped(!isFlipped);
        setIsAnimating(true);
    }
  }

  // Navigate to the next or previous card
  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false); // Reset flip state when navigating to the next card
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
    setIsFlipped(false); // Reset flip state when navigating to the previous card
  };

//   const toggleFlip = () => {
//     setFlipped((prevState) => !prevState);
//   };

   const { front, back } = flashcards[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Flashcard Container */}
      <div className="relative w-[600px] h-[350px]">

        {/* Left Arrow */}
        <button
          onClick={prevCard}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-blue-950 text-white p-3 rounded-full shadow-lg z-10 hover:bg-blue-900"
        >
          ←
        </button>


        {/* Flashcard */}
        <div
          onClick={handleFlip}
          className="flip-card w-[600px] h-[360px] rounded-md"
        >
          <motion.div
          className="flip-card-inner w-[100%] h-100%]"
          initial={false}
          animate={{rotateY: isFlipped ? 180 : 360}}
          transition={{duration: 0.4, animationDirection: "normal"}}
          onAnimationComplete={() => setIsAnimating(false)}
          >
            <div className="flip-card-front w-[100%] h-[100%] border-[1px] rounded-lg p-4 flex justify-center text-center items-center text-4xl">
                {front}
            </div>

            <div className="flip-card-back w-[100%] h-[100%] border-[1px] rounded-lg p-4 flex justify-center text-center items-center text-4xl">
                {back}
            </div>

          </motion.div>
        </div>


        {/* Right Arrow */}
        <button
          onClick={nextCard}
          className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-blue-950 text-white p-3 rounded-full shadow-lg z-10 hover:bg-blue-900"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
