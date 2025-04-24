'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const TranscriptContext = createContext();

export function useTranscript() {
  return useContext(TranscriptContext);
}

export function TranscriptProvider({ children }) {
  // Transcript will be an object: { videoUrl: string, text: string }
  const [transcript, setTranscriptState] = useState(null);

  // Load transcript from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transcript');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.videoUrl && parsed.text) {
          setTranscriptState(parsed);
        } else {
          localStorage.removeItem('transcript'); // Clean bad data
        }
      } catch (e) {
        console.error('Error parsing transcript from localStorage:', e);
        localStorage.removeItem('transcript');
      }
    }
  }, []);

  // Save transcript to localStorage whenever it changes
  useEffect(() => {
    if (transcript && transcript.videoUrl && transcript.text) {
      localStorage.setItem('transcript', JSON.stringify(transcript));
    }
  }, [transcript]);

  // Set transcript in context
  const setTranscript = (videoUrl, text) => {
    const newTranscript = { videoUrl, text };
    setTranscriptState(newTranscript);
  };

  // Get transcript, use cached if videoUrl matches
  const getTranscript = async (videoUrl) => {
    if (transcript && transcript.videoUrl === videoUrl) {
      return transcript.text;
    }

    try {
      const res = await fetch(`/api/getTranscript?videoUrl=${encodeURIComponent(videoUrl)}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      const newTranscript = { videoUrl, text: data.transcript };
      setTranscriptState(newTranscript);
      localStorage.setItem('transcript', JSON.stringify(newTranscript));
      return data.transcript;
    } catch (err) {
      console.error('Error fetching transcript:', err);
      throw err;
    }
  };

  const clearTranscript = () => {
    localStorage.removeItem('transcript');
    setTranscriptState(null); // or ''
  };

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript, getTranscript, clearTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
}
