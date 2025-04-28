'use client'

import React, {useState, useEffect, Suspense, useRef} from 'react'
import { Button } from './button';
import {  saveQuiz, generateFeedback, generateQuizQuestions, fetchTranscript } from "@/lib/api";
import '../../app/globals.css';
import { useUser } from '@clerk/nextjs';
import Loading from '@/app/loading';
import { toast } from 'react-hot-toast';
import { useTranscript } from '@/contexts/TranscriptContext';

const Quiz = ({ savedQuizzes, setSavedQuizzes }) => {
    const [quiz, setQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [error, setError] = useState('');
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [fetchAttempts, setFetchAttempts] = useState(0);

    const { transcript } = useTranscript();

    const { user } = useUser();

    const feedbackRef = useRef(null);

    useEffect(() => {
      // This runs once when the component first loads
      handleSubmit();
    }, []);
  
    const handleTranscriptFetch = async () => {
      setLoadingQuiz(true);

      if (!user) {
        setError('User is not authenticated.');
        setLoadingQuiz(false);
        return;
      }
  
      try {
        console.log('clerk auth id', user.id)
        const transcriptText = transcript.text;
        const data = await generateQuizQuestions(transcriptText);
        if (Array.isArray(data) && data.length > 0) {
          setQuiz(data);
          setUserAnswers(new Array(data.length).fill(''));
        
          // Get the Clerk user ID
          const userIdentifier = user.id;
          const videoUrl = transcript.videoUrl;
          const newQuiz = { userIdentifier, videoUrl, quiz: data };
          //setSavedQuizzes((prev) => [newQuiz, ...prev]);
          await saveQuiz(newQuiz);
  
          setSavedQuizzes((prev) => [newQuiz, ...prev]);
          setMessage('Quiz saved successfully!');
          console.log("Quiz Saved Successfully!");
        } else {
          setError('Unexpected format of quiz questions');
        }
      } catch (error) {
        setError('Failed to get quiz questons. Please try again.');
        console.log("Error with getting the quiz questions");
        setFetchAttempts(fetchAttempts + 1);
        if (fetchAttempts > 5){
          handleTranscriptFetch();
        }
      } finally {
        setLoadingQuiz(false);
      }
    };

    const handleQuizFeedbackFetch = async () => {
      setLoadingFeedback(true);

      if (!user) {
        setError('User is not authenticated.');
        setLoadingFeedback(false);
        return;
      }
  
      try {
        console.log('clerk auth id', user.id)
        const data = await generateFeedback(quiz, userAnswers);
        if (Array.isArray(data) && data.length > 0) {
          setFeedback(data);
          
          
          setMessage('Quiz Feedback got successfully!');
        } else {
          setError('Unexpected format of feedback');
        }
      } catch (error) {
        setError('Failed to fetch quizFeedback. Please try again.');
      } finally {
        setLoadingFeedback(false);
      }
    };
  
    const handleSubmit = (event) => {
      //event.preventDefault();
      setScore(null);
      setFeedback(null);
      setFetchAttempts(0);
      handleTranscriptFetch();
    };
  
    const handleAnswerChange = (questionIndex, answer) => {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[questionIndex] = answer;
      setUserAnswers(updatedAnswers);
    };
  
    const handleQuizSubmit = (event) => {
      event.preventDefault();
      toast.success("Quiz has been submitted!")
      let calculatedScore = 0;
      quiz.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
          calculatedScore += 1;
        }
      });
      setScore(calculatedScore);
      handleQuizFeedbackFetch();
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
  
    return (
      <div className="p-4 flex flex-col ">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mx-auto">Transform Your Learning Experience</h2>
        <p className=" text-lg mx-auto mt-3">
          Start creating engaging quizzes from your YouTube video here.
        </p>
        {!quiz && !loadingQuiz && (
          <div className="flex justify-center mt-10">
            <h1 className='text-red-200'>There was an Error while creating your quiz. Would you like to Try Again?</h1>
            <Button onClick={handleSubmit} className="ml-4">Try Again</Button>
          </div>
        )}
  
        <section className="container mx-auto px-4 md:px-6 ">
          {loadingQuiz ? (
            <Suspense  fallback={<Loading />} >
             <Loading className="mt-56"/>
            </Suspense>
          ) : (
            quiz && (
              <div className="max-w-3xl mx-auto mt-10">
                <h2 className="text-3xl font-bold tracking-tight mb-4 ">Your Quiz</h2>
                <form onSubmit={handleQuizSubmit} className="space-y-6">
                  {quiz.map((question, index) => (
                    <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-bold mb-2">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={userAnswers[index] === option}
                                onChange={() => handleAnswerChange(index, option)}
                                className="form-radio"
                              />
                              <span className="ml-2">{option}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className='flex flex-row justify-evenly w-full'>
                    <Button type="submit">Submit Quiz</Button>
                    {score !== null &&(
                      <Button onClick={handleSubmit}>Try Another Quiz</Button>
                    )}
                  </div>
                  
                </form>
                <div ref={feedbackRef}>
                  {score !== null && (
                    <div className="mt-6 text-center w-48 h-16 bg-white mx-auto rounded-md sm:mb-10 ">
                      <p className="text-xl font-bold text-black pt-4 ">Your Score: {score} / {quiz.length}</p>
                    </div>
                  )}
                </div>
                
              </div>
            )
          )}
          {loadingFeedback ? (
            <Suspense  fallback={<Loading />} >
             <Loading className="mt-56"/>
            </Suspense>
          ) : (
          feedback && feedback.map((entry, idx) => (
            <div key={idx} className="bg-white text-black shadow p-4 rounded mt-4">
              <h4 className="font-bold">{entry.question}</h4>
              <p>Your answer: <strong>{entry.user_answer}</strong></p>
              <p>Correct: <strong>{entry.correct ? '✅ Yes' : '❌ No'}</strong></p>
              <p className="mt-2 text-gray-700"><em className='font-bold'>Feedback:</em> {entry.explanation}</p>
            </div>
          )))}
        </section>
      </div>
    );
  };

export default Quiz