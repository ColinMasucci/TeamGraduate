import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LeaderboardEntry from '@/models/LeaderboardEntry'; // Change if you named your model differently

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, username, score } = await req.json();
    console.log('saveScore', userId, username, score);

    if (!userId || !username || typeof score !== 'number') {
      return NextResponse.json({ error: 'All fields are required and score must be a number' }, { status: 400 });
    }

    const newEntry = new LeaderboardEntry({ userId, username, score });
    await newEntry.save();

    return NextResponse.json({ message: 'Score saved successfully', entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
