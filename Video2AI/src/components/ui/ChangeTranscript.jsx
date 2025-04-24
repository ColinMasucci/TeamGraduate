'use client'

import React, {useState, useEffect, Suspense} from 'react'
import { Button } from './button';
import { Input } from './input';
import { saveTranscript, fetchTranscript } from "@/lib/api";
import { v4 as uuidv4 } from 'uuid';
import '../../app/globals.css';
import { useUser } from '@clerk/nextjs';
import Loading from '@/app/loading';
import { toast } from 'react-hot-toast';
import { TranscriptContext } from '@/contexts/TranscriptContext';
import { useTranscript } from '@/contexts/TranscriptContext';

const WHITELISTED_EMAILS = [
    "colined14@gmail.com"
];

const ChangeTranscript = ({ initialLink }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('');
    const [loadingTranscript, setLoadingTranscript] = useState(false);
    const [loadedTranscript, setLoadedTranscript] = useState(false);
    const [transcriptAdded, setTranscriptAdded] = useState(false);
    const [message, setMessage] = useState('');

    const [transcriptToAdd, setTranscriptToAdd] = useState('');

    //const { transcript, setTranscript } = useTranscript();
    const { transcript, setTranscript, getTranscript, clearTranscript } = useTranscript();

    const { user } = useUser();
    const isWhitelisted = user && WHITELISTED_EMAILS.includes(user.emailAddresses?.[0]?.emailAddress);

    useEffect(() => {
      if (initialLink && initialLink != 'null' && initialLink != null) {
        if (transcript && initialLink != transcript.videoUrl){
            clearTranscript();
        }
        setVideoUrl(initialLink);
      }
    }, [initialLink]);


    const handleLoadTranscript = async () => {
        if (!videoUrl) return null;
    
        setLoadingTranscript(true);
        await clearTranscript(); //clears the cache so that it does not interfere when you load a script in.
    
        if (!user) {
            setError('User is not authenticated.');
            setLoadingTranscript(false);
            return;
        }
        console.log('clerk auth id', user.id);
    
        // If already in context
        if (transcript && transcript.videoUrl === videoUrl) {
            setLoadingTranscript(false);
            setLoadedTranscript(true);
            console.log("was already in the context.");
            console.log(transcript);
            return transcript.text;
        }

        // Check if in localStorage
        try {
            console.log("checking in local storage");
            const stored = localStorage.getItem('transcript');
          
            // Check if it's a valid JSON object
            if (stored?.trim()?.startsWith('{')) {
              const parsed = JSON.parse(stored);
              if (parsed.videoUrl === videoUrl) {
                setTranscript(parsed.text);
                setLoadingTranscript(false);
                return parsed.text;
              }
            } else {
              // It's an old format, just clear it
              console.warn('Old format transcript found in localStorage, clearing...');
              localStorage.removeItem('transcript');
            }
          } catch (e) {
            console.error('Error parsing transcript from localStorage:', e);
            localStorage.removeItem('transcript'); // Clear bad data
        }
    
        // Otherwise, fetch from API
        try {
            console.log("fetching from database");

            const data = await fetchTranscript(videoUrl);
            const thisTranscript = data.transcript;

            if (thisTranscript?.length > 0) {
                setTranscript(videoUrl, thisTranscript);
                localStorage.setItem('transcript', JSON.stringify({ videoUrl, text: thisTranscript })); //save to local storage
                setLoadedTranscript(true);
                //console.log(thisTranscript);
                return thisTranscript;
            }else {
                console.error('Error fetching transcript:', data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error fetching transcript:', err);
        } finally {
            setLoadingTranscript(false);
        }
    
        return null;
    };
  
    

    

    const handleSaveTranscript = async () => {
        setLoadingTranscript(true);

        if (!user) {
            setError('User is not authenticated.');
            setLoadingTranscript(false);
            return;
        }
        try {
            console.log('clerk auth id', user.id)
            const result = await saveTranscript(user.id, videoUrl, transcriptToAdd);
            
            if (result?.transcript?.transcript?.length > 0) {
                setMessage('Transcript saved successfully to database!');
                setTranscriptAdded(true);
                console.log('Saved transcript to database');
            } else {
                setError('Unexpected format of transcript.');
            }
        } catch (error) {
            setError('Failed to save transcript. Please try again.');
        } finally {
            setLoadingTranscript(false);
        }
    };
  
    const handleUseTranscript = (event) => {
      event.preventDefault();
      handleLoadTranscript();
    };

    const handleAddTranscript = (event) => {
        event.preventDefault();
        handleSaveTranscript();
    };

    const clearTheContext = (event) => {
        event.preventDefault();
        clearTranscript();
    }
  
  
    return (
      <div className="p-4 flex flex-col ">
        {/* <Button onClick={clearTheContext}> [Debug Button] Erase Cache</Button> */}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mx-auto text-center max-w-xl">Before Using this Tool Please Enter the URL for the You Tube lesson you would like to study from.</h2>
        <p className=" text-lg mx-auto mt-3">
          Enter the URL below and click Submit.
        </p>
        <div className="flex justify-center mt-10">
          <input
            type="text"
            placeholder="  Enter YouTube video link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="max-w-md flex-1 rounded-md text-white bg-blue-950"/>
          {transcriptToAdd && isWhitelisted ? (
            <Button onClick={handleAddTranscript} className="ml-4">Add Transcript to Database</Button>
          ):
          (
            <Button onClick={handleUseTranscript} className="ml-4">Use Transcript</Button>
          )}
        </div>
        <div className="flex items-center justify-center">
            <div className="text-center max-w-xl">
                {!transcript ? (
                    <h1 className="text-red-200">
                        No Transcript Loaded Yet!
                    </h1>
                ) : (
                    <h1 className="text-green-200">
                        Transcript Loaded! You can now access the Study Materials.
                    </h1>    
                )}
            </div>
        </div>
        <div className="flex items-center justify-center">
            <div className="text-center max-w-xl">
                {transcriptAdded && (
                <h1 className="text-green-200">
                    ***The Transcript was added successfully and can now be used by Students. Delete all the text in the box below and then click on the 'Use Transcript' Button to test out your new Transcript Study Materials***
                </h1>
                )}
            </div>
        </div>
     
        <section className="container mx-auto px-4 md:px-6 ">
          {loadingTranscript && (
            <Suspense  fallback={<Loading />} >
             <Loading className="mt-56"/>
            </Suspense>
          )}
        </section>
        {isWhitelisted && (
            <div className="flex flex-col space-y-2 items-center">
                <label htmlFor="transcript" className="font-medium text-white">
                    To Add a Transcript for Students, Paste it Below
                </label>
                <textarea
                    id="transcript"
                    name="transcript"
                    rows={10}
                    className="w-full max-w-2xl p-4 border text-black border-blue-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Paste transcript here..."
                    value={transcriptToAdd}
                    onChange={(e) => setTranscriptToAdd(e.target.value)}
                />
            </div>
        )}
      </div>
    );
  };

export default ChangeTranscript