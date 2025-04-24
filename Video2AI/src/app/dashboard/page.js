
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Quiz from '@/components/ui/Quiz';
import History from '@/components/ui/History';
import Pricing from '@/components/ui/Pricing';
import MatchingGame from '@/components/ui/MatchingGame';
import FlashcardPage from '@/components/ui/FlashcardPage';
import { useUser } from '@clerk/nextjs';
import { saveTimeSpent } from "@/lib/api";
import ChangeTranscript from '@/components/ui/ChangeTranscript';
import { TranscriptProvider } from '@/contexts/TranscriptContext';

const Page = () => {
  const [activePage, setActivePage] = useState('ChangeTranscript');
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  const searchParams = useSearchParams();
  const link = searchParams.get('link'); // <-- grab URL param if it exists

  const { user } = useUser();

  const startTimeRef = useRef(Date.now());
  const previousPageRef = useRef(activePage);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');


  const sendTimeSpent = async (page, durationMs) => {
    if (!user) {
      setError('User is not authenticated.');
      return;
    }
      
    try {
      console.log('this clerk auth id', user.id)
      await saveTimeSpent(user.id, page, durationMs, );
      setMessage('Quiz saved successfully!');
    } catch (error) {
      setError('Failed to save Time Spent On Page.');
    }
  };

      

  // Track time when activePage changes
  useEffect(() => {
    const now = Date.now();
    const duration = now - startTimeRef.current;

    // Send data for previous page
    if (previousPageRef.current !== activePage) {
      sendTimeSpent(previousPageRef.current, duration);
    }

    // Update timers
    startTimeRef.current = now;
    previousPageRef.current = activePage;
  }, [activePage]);

  // Track time when user closes tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Date.now() - startTimeRef.current;
      sendTimeSpent(previousPageRef.current, duration);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'Quiz':
        return <Quiz savedQuizzes={savedQuizzes} setSavedQuizzes={setSavedQuizzes} initialLink={link}/>;
      case 'History':
        return <History savedQuizzes={savedQuizzes} setSavedQuizzes={setSavedQuizzes}/>;
      case 'Pricing':
        return <Pricing />;
      case 'MatchingGame':
        return <MatchingGame />;
      case 'FlashcardPage':
        return <FlashcardPage />;
      case 'ChangeTranscript':
        return <ChangeTranscript initialLink={link}/>;
      default:
        return <ChangeTranscript />;
    }
  };

  return (
    <TranscriptProvider>
      <main className="flex flex-col sm:flex-row  bg-gray-500 min-h-screen">
        {/* Sidebar */}
        <Sidebar onSelect={setActivePage} />

        {/* Main Content */}
        <div className="flex-grow p-4 mt-10 sm:mt-0 sm:ml-40 bg-gray-500">
          {user ? (
            renderContent()
          ) : (
            <div className='flex items-center justify-center text-center font-bold text-2xl mt-20'>
              <h1>Click <b>Login</b> Found at the Top Left</h1>
            </div>
          )}
        </div>
      </main>
    </TranscriptProvider>
  );
};

export default Page;

