import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API;

async function generateFeedback(quiz, userAnswers) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a helpful tutor. The user will give you a quiz consisting of questions, options, correct answers, and the user's selected answer. 
For each question, reply in JSON with:

- the question
- the user's selected answer
- whether it was correct (true/false)
- a step-by-step explanation of how to arrive at the correct answer (like a tutor would explain it)

Here's the data:
${JSON.stringify(quiz.map((q, i) => ({
  question: q.question,
  options: q.options,
  correct_answer: q.correct_answer,
  user_answer: userAnswers[i]
})))}
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) {
      console.error('No valid JSON array found in the AI response:', text);
      throw new Error('Failed to parse feedback JSON.');
    }

    const feedbackArray = JSON.parse(jsonMatch[0]);
    return feedbackArray;
  } catch (error) {
    console.error('Failed to generate feedback:', error);
    throw new Error('Failed to generate feedback');
  }
}

export async function POST(req) {
  const { quiz, userAnswers } = await req.json();

  if (!quiz || !userAnswers) {
    return NextResponse.json({ error: 'quiz and userAnswers are required' }, { status: 400 });
  }

  try {
    const feedback = await generateFeedback(quiz, userAnswers);
    console.log('Feedback JSON:', feedback);
    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
