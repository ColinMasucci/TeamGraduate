import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/dbConnect';
import { readFile } from 'fs/promises';
import path from 'path';

const apiKey = process.env.GOOGLE_GEMINI_API

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
            { text: "you will be given a description of the video and you need to return me a JSON object of 6 questions(that will be slightly changed so that it is not the same as the video with the first two being very easy, the second two being less easy difficulty and the last two being medium and write at the top the difficulty) with its options and the correct answer (labeled as correct_answer) that you will generate on basis of the description " },
          ],
        },
        {
          role: 'model',
          parts: [
            { text: "Okay, I'm ready! Please provide me with the description of the video. I will then analyze it and generate a JSON object of 6 multiple-choice questions(that will be slightly changed so that it is not the same as the video with the first two being very easy, the second two being less easy difficulty and the last two being medium and labeled as such) with multiple choice options as well as the correct answer(labeled as correct_answer) for you." },
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
    console.error('Failed to generate quiz questions from /api/quizQuestions', error);
    console.log(JSON.stringify(error))
    throw new Error('Failed to generate quiz questions from /api/quizQuestions');
  }
}

//flow starts from here
export async function POST(req) {
    try {
      const { transcript } = await req.json();
      console.log("Received transcript, first few words:", transcript?.split(' ').slice(0, 10).join(' '));
  
      if (!transcript || transcript.trim() === '') {
        return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
      }
  
      const quizQuestions = await generateQuizQuestions(transcript);
      console.log('Generated quiz questions:', quizQuestions);
  
      return NextResponse.json(quizQuestions);
    } catch (error) {
      console.error('Error in /api/quizQuestions:', error);
      return NextResponse.json({ error: 'Failed to generate quiz questions' }, { status: 500 });
    }
  }
  

//maybe use officla youtube data api to fetch transcript / subtitile
// use a proxy service as in github issues and stackoverflow
//   PROXY_URL=http://public-proxy-server.com:8080

