
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

const Page = () => {
  const [activePage, setActivePage] = useState('Quiz');
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
      default:
        return <Quiz />;
    }
  };

  return (
    <main className="flex flex-col sm:flex-row  bg-gray-500 min-h-screen">
      {/* Sidebar */}
      <Sidebar onSelect={setActivePage} />

      {/* Main Content */}
      <div className="flex-grow p-4 mt-10 sm:mt-0 sm:ml-40 bg-gray-500">
        {renderContent()}
      </div>
    </main>
  );
};

export default Page;

