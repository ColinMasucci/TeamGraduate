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
  const filePath = path.join(process.cwd(), 'src', 'app', 'sample-transcript.txt');
  console.log("Filepath: " + filePath);
  const rawText = await readFile(filePath, 'utf-8');
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

async function generateQuizQuestions(description) {
  try {
    const firstFewLines = description.split(' ').slice(0, 10).join(' ');
    console.log('Generating quiz questions with description:', firstFewLines, "...");
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
            { text: "you will be given a description of the video and you need to return me a JSON object of 5 questions with its options and correct answer that you will generate on basis of the description. Change up the questions and answers so that they are not the exact ones given in the description." },
          ],
        },
        {
          role: 'model',
          parts: [
            { text: "Okay, I'm ready! Please provide me with the description of the video. I will then analyze it and generate 5 multiple-choice questions with options and the correct answer for you that are similar but not the same." },
          ],
        },
        {
          role: 'user',
          parts: [
            { text: description },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(description);
    const rawResponse = await result.response.text();

    console.log('Raw response from Google Generative AI:', rawResponse);

    const jsonMatch = rawResponse.match(/\[.*\]/s);
    if (!jsonMatch) {
      console.error('Raw Gemini response:', rawResponse);
      throw new Error('No valid JSON array found in the response');
    }

    const cleanResponse = jsonMatch[0];
    const parsedResponse = JSON.parse(cleanResponse);
    console.log('Parsed quiz questions:', parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error('Failed to generate quiz questions from /api/transcript', error);
    console.log(JSON.stringify(error))
    throw new Error('Failed to generate quiz questions from /api/transcript');
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

    const quizQuestions = await generateQuizQuestions(transcriptText);
    console.log('Generated quiz questions:', quizQuestions);

    return NextResponse.json(quizQuestions);
  } catch (error) {
    console.error('Error in generateQuizQuestions:', error.message);
    console.error('Error in generateQuizQuestions:', error);
    return NextResponse.json({ error: 'Failed to generate quiz questions from /api/transcript' }, { status: 500 });
  }
}

//maybe use officla youtube data api to fetch transcript / subtitile
// use a proxy service as in github issues and stackoverflow
//   PROXY_URL=http://public-proxy-server.com:8080

