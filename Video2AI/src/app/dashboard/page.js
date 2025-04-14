
'use client'

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Quiz from '@/components/ui/Quiz';
import History from '@/components/ui/History';
import Pricing from '@/components/ui/Pricing';
import MatchingGame from '@/components/ui/MatchingGame';
import FlashcardPage from '@/components/ui/FlashcardPage';
import GetStartedButton from '@/components/ui/GetStartedButton';

const Page = () => {
  const [activePage, setActivePage] = useState('Quiz');
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  const searchParams = useSearchParams();
  const link = searchParams.get('link'); // <-- grab URL param if it exists

  const renderContent = () => {
    switch (activePage) {
      case 'Quiz':
        return <Quiz savedQuizzes={savedQuizzes} setSavedQuizzes={setSavedQuizzes} initialLink={link}/>;
      case 'History':
        return <History savedQuizzes={savedQuizzes} setSavedQuizzes={setSavedQuizzes}/>;
      case 'Pricing':
        return <Pricing />;
      case 'Login':
        return <GetStartedButton />;
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

