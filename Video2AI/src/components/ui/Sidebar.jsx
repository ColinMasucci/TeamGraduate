
'use client';
import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { MdOutlineQuiz } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { TbGoGame } from "react-icons/tb";
import { RxCardStack } from "react-icons/rx";
import SidebarAuthButton from './SideBarAuthButton';
import { useTranscript } from '@/contexts/TranscriptContext';
import { AiOutlineFileSync } from "react-icons/ai";
import { useUser } from '@clerk/nextjs';


export default function Sidebar({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const { transcript } = useTranscript();
  const { user } = useUser();

  return (
    <div>
      {/* Hamburger Menu for Mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <GiHamburgerMenu
          size={30}
          onClick={toggleSidebar}
          className="cursor-pointer text-white"
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen max-h-screen w-48 bg-blue-950 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:flex sm:flex-col sm:visible z-40`}
      >
        <div className="flex flex-col items-center h-full">
          {/* Close Icon for Mobile */}
          <div className="self-end p-4 sm:hidden">
            <MdClose
              size={30}
              onClick={toggleSidebar}
              className="cursor-pointer text-white"
            />
          </div>

          {/* Sidebar Links */}
          <div className="flex flex-col justify-center items-start gap-8 ml-10 mt-20 w-full">
            {/* <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('Login')}>
              <FiLogIn size={24} className="text-yellow-300" />
              <h3 className="text-white text-lg hover:text-yellow-300">Login</h3>
            </div> */}
            <SidebarAuthButton/>
            {user ? (
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('ChangeTranscript')}>
                <AiOutlineFileSync size={24} className="text-yellow-300" />
                <h3 className="text-white text-lg hover:text-yellow-300">Transcript</h3>
              </div>
            ) : (
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('')}>
                <AiOutlineFileSync size={24} className="text-yellow-600" />
                <h3 className="text-gray-500 text-lg">Transcript</h3>
              </div>
            )}
            
            {transcript && user ? (
              <div className="flex flex-col justify-center items-start gap-8 w-full">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('Quiz')}>
                  <MdOutlineQuiz size={24} className="text-yellow-300" />
                  <h3 className="text-white text-lg hover:text-yellow-300">Quiz</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('History')}>
                  <FaHistory size={24} className="text-yellow-300" />
                  <h3 className="text-white text-lg hover:text-yellow-300">History</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('FlashcardPage')}>
                  <RxCardStack size={24} className="text-yellow-300" />
                  <h3 className="text-white text-lg hover:text-yellow-300">Flashcards</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('MatchingGame')}>
                  <TbGoGame size={24} className="text-yellow-300" />
                  <h3 className="text-white text-lg hover:text-yellow-300">Matching Game</h3>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-start gap-8 w-full">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('')}>
                  <MdOutlineQuiz size={24} className="text-yellow-600" />
                  <h3 className="text-gray-500 text-lg">Quiz</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('')}>
                  <FaHistory size={24} className="text-yellow-600" />
                  <h3 className="text-gray-500 text-lg">History</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('')}>
                  <RxCardStack size={24} className="text-yellow-600" />
                  <h3 className="text-gray-500 text-lg">Flashcards</h3>
                </div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect('')}>
                  <TbGoGame size={24} className="text-yellow-600" />
                  <h3 className="text-gray-500 text-lg">Matching Game</h3>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
