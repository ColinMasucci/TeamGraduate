'use client';

import React, { useEffect, useRef } from 'react';

const itemsData = [
  { id: 'word1', text: 'Ecosystem', match: 'word1' },
  { id: 'word2', text: 'Photosynthesis', match: 'word2' },
  { id: 'word3', text: 'Gravity', match: 'word3' },
  {
    id: 'def1',
    text: 'A community of living organisms and their environment',
    match: 'word1',
  },
  {
    id: 'def2',
    text: 'The process plants use to convert sunlight into energy',
    match: 'word2',
  },
  {
    id: 'def3',
    text: 'The force that pulls objects toward the Earth',
    match: 'word3',
  },
];

const getRandomPosition = () => {
  const left = Math.random() * 80 + 10;
  const top = Math.random() * 80 + 10;
  return { left: `${left}%`, top: `${top}%` };
};

const MatchingGame = () => {
  const gameAreaRef = useRef(null);

  useEffect(() => {
    const items = document.querySelectorAll('.drag-item');

    items.forEach((item) => {
      const { left, top } = getRandomPosition();
      item.style.left = left;
      item.style.top = top;

      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.5';
      });

      item.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
      });
    });

    const gameArea = gameAreaRef.current;

    // const handleDrop = (e) => {
    //   e.preventDefault();
    //   const id = e.dataTransfer.getData('text/plain');
    //   const dragged = document.getElementById(id);

    //   const rect = gameArea.getBoundingClientRect();
    //   dragged.style.left = `${e.clientX - rect.left - dragged.offsetWidth / 2}px`;
    //   dragged.style.top = `${e.clientY - rect.top - dragged.offsetHeight / 2}px`;

    //   const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    //   console.log(dropTarget);
    // //   if (
    // //     dropTarget &&
    // //     dropTarget.dataset.match === dragged.dataset.match &&
    // //     dropTarget !== dragged
    // //   ) {
    // //     dragged.remove();
    // //     dropTarget.remove();
    // //   }
    // //   else if(dragged.dataset.match === dropTarget.dataset.match && dropTarget !== dragged){
    // //     dragged.remove();
    // //     dropTarget.remove();
    // //   }

    //   if (dropTarget && dropTarget.classList.contains('drag-item') && dropTarget.dataset.match === dragged.dataset.match) {
    //     if (dropTarget !== dragged) {
    //       dragged.remove();
    //       dropTarget.remove();
    //     }
    //   }
    // };

    const handleDrop = (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const dragged = document.getElementById(id);
      
        // Update dragged item position
        const rect = gameArea.getBoundingClientRect();
        dragged.style.left = `${e.clientX - rect.left - dragged.offsetWidth / 2}px`;
        dragged.style.top = `${e.clientY - rect.top - dragged.offsetHeight / 2}px`;
      
        // Get the drop target based on mouse position
        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        console.log(dropTarget);
        // Ensure we find the correct word (not the definition)
        let targetWord = dropTarget;
        while (targetWord && !targetWord.dataset.match) {
          targetWord = targetWord.parentElement; // Traverse up the DOM to find the word
        }
      
        // If a valid word is found and matches the dragged item, remove both the word and the definition
        if (targetWord && targetWord.dataset.match === dragged.dataset.match && targetWord !== dragged) {
          dragged.remove();   // Remove the definition
          targetWord.remove(); // Remove the word
        }
    };
      

    gameArea.addEventListener('dragover', (e) => e.preventDefault());
    gameArea.addEventListener('drop', handleDrop);

    return () => {
      gameArea.removeEventListener('dragover', (e) => e.preventDefault());
      gameArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div className="w-full text-center">
      <h1 className="text-2xl font-bold mb-6">
        Match Words to Their Definitions
      </h1>
      <div
        ref={gameAreaRef}
        className="relative mx-auto w-full max-w-6xl h-[80vh] border-4 border-gray-800 bg-white rounded-lg overflow-hidden"
      >
        {itemsData.map((item) => (
          <div
            key={item.id}
            id={item.id}
            draggable
            data-match={item.match}
            className="drag-item absolute bg-green-500 text-white px-4 py-2 rounded shadow-lg cursor-grab select-none w-40"
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingGame;
