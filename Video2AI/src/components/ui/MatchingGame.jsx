'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getMatchingPairs,  saveMatchingResult, fetchLeaderboard } from "@/lib/api";
import { useUser } from '@clerk/nextjs';
import { useTranscript } from '@/contexts/TranscriptContext';

// const itemsData = [
//   { id: 'word1', text: 'Ecosystem', match: 'word1' },
//   { id: 'word2', text: 'Photosynthesis', match: 'word2' },
//   { id: 'word3', text: 'Gravity', match: 'word3' },
//   {
//     id: 'def1',
//     text: 'A community of living organisms and their environment',
//     match: 'word1',
//   },
//   {
//     id: 'def2',
//     text: 'The process plants use to convert sunlight into energy',
//     match: 'word2',
//   },
//   {
//     id: 'def3',
//     text: 'The force that pulls objects toward the Earth',
//     match: 'word3',
//   },
// ];

const transformToMatchingData = (data) => {
    const items = [];
  
    data.forEach((pair, index) => {
      const matchId = `match${index + 1}`;
      items.push(
        {
          id: `term-${index}`,
          text: pair.term || pair.question || `Term ${index + 1}`,
          match: matchId,
        },
        {
          id: `def-${index}`,
          text: pair.definition || pair.answer || `Definition ${index + 1}`,
          match: matchId,
        }
      );
    });
  
    return items;
};
  

const getRandomPosition = () => {
  const left = Math.random() * 80 + 10;
  const top = Math.random() * 80 + 10;
  return { left: `${left}%`, top: `${top}%` };
};

const MatchingGame = () => {
  const gameAreaRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [itemsData, setItemsData] = useState(null);
  const [itemsRemaining, setItemsRemaining] = useState(-1);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const { transcript } = useTranscript();

  const handleMatchingPairsFetch = async (term, def) => {
    setLoading(true);

    if (!user) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        console.log('clerk auth id', user.id)
        const transcriptText = transcript.text;
        const data = await getMatchingPairs(transcriptText);
        if (Array.isArray(data) && data.length > 0) {
          setItemsData(transformToMatchingData(data));
        } else {
          setError('Unexpected format for matching terms');
        }
      } catch (error) {
        setError('Failed to fetch matchingPairs. Please try again.');
      } finally {
        setLoading(false);
      }
  };

  const handleShowLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard();
      setLeaderboardData(data);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  //Once started initialize all the draggable objects
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
  }, [started]);


  useEffect(() => {
    if (!started) return;

    const gameArea = gameAreaRef.current;

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

          // Update state for win check
          setItemsRemaining((prev) => {
            const newCount = prev - 2;
            if (newCount === 0) {
              clearInterval(timerId);
            }
            return newCount;
          });
        }
    };
      

    gameArea.addEventListener('dragover', (e) => e.preventDefault());
    gameArea.addEventListener('drop', handleDrop);

    return () => {
      gameArea.removeEventListener('dragover', (e) => e.preventDefault());
      gameArea.removeEventListener('drop', handleDrop);
    };
  }, [started, time, timerId]);


  //Set start state and Timer once the MatchingItems are assigned
  useEffect(() => {
    if (itemsData){
      setStarted(true);
      setItemsRemaining(itemsData.length);
      const intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
      setTimerId(intervalId);
    }
  }, [itemsData])

  //Runs after handleStart
  useEffect(() => {
    if (videoUrl) {
      handleMatchingPairsFetch();
    }
  }, [videoUrl]);

  //When there are no more itms this runs
  useEffect(() => {
    if (itemsRemaining === 0 && time > 0) {
      // Save score
      saveMatchingResult(user.id, user.fullName, time)
        .then(() => console.log('Score saved!'))
        .catch(err => console.error(err));
    }
  }, [itemsRemaining]);


  //When the Start Button is pressed
  const handleStart = () => {
    setVideoUrl("https://youtube.com");
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full text-center">

      <h1 className="text-2xl font-bold mb-6">Match Words to Their Definitions</h1>
      <div className="mb-4 text-xl font-mono text-gray-100">
        ⏱ Time: {formatTime(time)}
      </div>

      <div
        ref={gameAreaRef}
        className="relative mx-auto w-full max-w-6xl h-[80vh] border-4 border-gray-800 bg-white rounded-lg overflow-hidden"
      >
        <div className="z-50 flex flex-col w-full h-full items-center justify-center bg-opacity-95">
            {!started && (
                <div className="z-50 flex flex-col w-full h-full items-center justify-center bg-opacity-95">
                    <h1 className="text-3xl text-black font-bold mb-4">Matching Game</h1>
                    <p className="mb-6 text-black text-lg">Match each word with its definition!</p>
                    {loading ? (
                      <div className="mt-5 w-48 h-2 bg-gray-300 rounded-full overflow-hidden mb-6">
                          <div className="h-full bg-blue-700 animate-pulse w-full"></div>
                      </div>
                    ) : (
                      <button
                          onClick={handleStart}
                          className="bg-blue-950 text-white px-6 py-3 rounded text-lg shadow hover:bg-blue-900 transition"
                      >
                          Start Game
                      </button>
                    )}
                </div>
            )}

            {itemsRemaining == 0 && (
              <div>
              {showLeaderboard ? (
                <div className="fixed text-black inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard</h2>
                    <ol className="list-decimal pl-6">
                      {leaderboardData.map((entry, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-semibold">{entry.username}</span> - {formatTime(entry.score)}
                        </li>
                      ))}
                    </ol>
                    <button
                      onClick={() => setShowLeaderboard(false)}
                      className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
              <div className="z-50 flex flex-col w-full h-full items-center justify-center bg-opacity-95">
                  <h1 className="text-3xl text-black font-bold mb-4">🎉 You won! 🎉</h1>
                  <p className="mb-6 text-black text-lg">Time: {formatTime(time)}</p>
                  <button
                    onClick={handleShowLeaderboard}
                    className="bg-blue-800 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
                  >
                    View Leaderboard
                  </button>
              </div>
              )}
              </div>
            )}
        </div>

        {started && itemsData.map((item) => (
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
