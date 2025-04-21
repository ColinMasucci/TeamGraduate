import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/dbConnect';
import { readFile } from 'fs/promises';
import path from 'path';

// const apiKey = 'AIzaSyA4l9CPHtDAptuqpNB8J_c8u4hIPA-18sA';
const apiKey = process.env.GOOGLE_GEMINI_API

async function fetchTranscript(videoUrl) {
  try {
    console.log(`Fetching transcript for video URL: ${videoUrl}`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        // Add other necessary headers if required
      }} );

    const cleanedTranscript = transcript.map(entry => entry.text.replace(/&#?\w+;/g, ' ').trim()).join('\n');
    console.log('Transcript fetched and cleaned');
    return cleanedTranscript;
  } catch (error) {
    console.error('Failed to fetch transcript', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      videoUrl, 
      apiKey
    });

    if (error.message.includes('Transcript is disabled')) {
      throw new Error('Transcript is disabled for this video');
    }

    throw new Error('Failed to fetch transcript');
  }
}

async function fetchSampleTranscript() {

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log(baseUrl);
  const res = await fetch(`${baseUrl}/heart-transcript.txt`);
  const rawText = await res.text();

  const firstFewLines = rawText.split(' ').slice(0, 10).join(' ');
  console.log("Transcript: " + firstFewLines);

  // Split into lines, clean, and structure
  const transcript = rawText
    .split('\n')
    .filter(line => line.trim()) // remove empty lines
    .map(line => ({
      text: line.trim(),
      offset: null // no timestamps available
    }));

  //return transcript;
  return transcript.map(entry => entry.text).join('\n');
}

async function getMatchingPairs(description) {
    try {
      const firstFewLines = description.split(' ').slice(0, 10).join(' ');
      console.log('Generating matching pairs with description:', firstFewLines, "...");
  
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
  
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };
  
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: 'user',
            parts: [
              {
                text:
                  `You will be given a video description. Based on it, return a JSON array of 7 matching term-definition pairs. ` +
                  `Format: [{ "id": "int", "term": "string", "definition": "string" }, ...]. "id" should be incremented for each new pair. Keep the pairs very much relevant to the content in the description as this is the most important aspect.`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text: `Okay! I'm ready. Please provide the description of the video and I’ll return 7 matching pairs in JSON format as requested.`,
              },
            ],
          },
          {
            role: 'user',
            parts: [{ text: description }],
          },
        ],
      });
  
      const result = await chatSession.sendMessage(description);
      const rawResponse = await result.response.text();
  
      console.log('Raw response from Gemini:', rawResponse);
  
      const jsonMatch = rawResponse.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in the response');
      }
  
      const cleanResponse = jsonMatch[0];
      const parsedResponse = JSON.parse(cleanResponse);
      console.log('Parsed term-definition pairs:', parsedResponse);
  
      return parsedResponse;
    } catch (error) {
      console.error('Failed to generate quiz pairs', error);
      throw new Error('Failed to generate matching pairs from description');
    }
}
  

//flow starts from here
export async function POST(req) {
  const { videoUrl } = await req.json();
  console.log("Received video URL:", videoUrl);
  if (!videoUrl) {
    console.error('Video URL is required');
    return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
  }

  try {
    console.log('Attempting to fetch transcript...');
    //const transcriptText = await fetchTranscript(videoUrl);
    const transcriptText = await fetchSampleTranscript();
    const firstFewLines = transcriptText.split(' ').slice(0, 10).join(' ');
    console.log('Transcript fetched successfully:', firstFewLines, "...");

    if (!transcriptText) {
      console.error('Failed to fetch transcript in /transcript');
      return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
    }

    const matchPairs = await getMatchingPairs(transcriptText);
    console.log('Generated match pairs:', matchPairs);

    return NextResponse.json(matchPairs);
  } catch (error) {
    console.error('Error in generatematchPairs:', error.message);
    console.error('Error in generatematchPairs:', error);
    return NextResponse.json({ error: 'Failed to generate match pairs from /api/getMatchingPairs' }, { status: 500 });
  }
}

//maybe use officla youtube data api to fetch transcript / subtitile
// use a proxy service as in github issues and stackoverflow
//   PROXY_URL=http://public-proxy-server.com:8080

