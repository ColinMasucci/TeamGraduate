'use client';

import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import { getMatchingPairs } from "@/lib/api";
import { Button } from './button';
import { useUser } from '@clerk/nextjs';

// Flashcard Data Sample
// const flashcards = [
//   { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces' },
//   { id: 2, front: 'What is Tailwind CSS?', back: 'A utility-first CSS framework' },
//   { id: 3, front: 'What is JSX?', back: 'A syntax extension for JavaScript used in React' },
//   { id: 4, front: 'What is a component in React?', back: 'Reusable building blocks of React applications' },
// ];

const FlashcardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [flashcards, setFlashcards] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');


  const handleMatchingPairsFetch = async (term, def) => {
        setLoading(true);
  
      if (!user) {
          setError('User is not authenticated.');
          setLoading(false);
          return;
        }
    
        try {
          console.log('clerk auth id', user.id)
          const data = await getMatchingPairs(videoUrl);
          if (Array.isArray(data) && data.length > 0) {
            setFlashcards(data);
          } else {
            setError('Unexpected format of flashcards');
          }
        } catch (error) {
          setError('Failed to fetch transcript. Please try again.');
        } finally {
          setLoading(false);
        }
    };

  function handleFlip(){
    if (!isAnimating){
        setIsFlipped(!isFlipped);
        setIsAnimating(true);
    }
  }

  

  // Navigate to the next or previous card
  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false); 
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
    setIsFlipped(false); 
  };

  
  const handleLoadFlashcards = (event) => {
    event.preventDefault();
    setVideoUrl("https://youtube.com");
  };

  useEffect(() => {
    if (flashcards && flashcards.length > 0 && flashcards[currentIndex]) {
      const card = flashcards[currentIndex];
      setTerm(card.term);
      setDefinition(card.definition);
    }
  }, [flashcards, currentIndex]);

  useEffect(() => {
    if (videoUrl) {
      handleMatchingPairsFetch();
    }
  }, [videoUrl]);


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
        {flashcards.length>0 && 
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
                        {term}
                    </div>

                    <div className="flip-card-back w-[100%] h-[100%] border-[1px] rounded-lg p-4 flex justify-center text-center items-center text-4xl">
                        {definition}
                    </div>

                </motion.div>
            </div>
        }
        {flashcards.length<=0 &&
            <div className="z-50 flex flex-col w-full h-full items-center justify-center bg-opacity-95">
                <h1>No Flashcards Loaded!</h1>
                {loading ? (
                    <div className="mt-6 w-48 h-2 bg-gray-300 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-blue-700 animate-pulse w-full"></div>
                    </div>
                ) : (
                    <Button
                    onClick={handleLoadFlashcards}
                    className="mt-4 px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white"
                    >
                    Load Flashcards
                    </Button>
                )}
            </div>
        }
        


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
