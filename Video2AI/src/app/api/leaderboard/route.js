import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LeaderboardEntry from '@/models/LeaderboardEntry'; // Adjust this to match your actual model name

export async function GET() {
  await dbConnect();

  try {
    // Fetch leaderboard entries, sorted by score descending
    const leaderboard = await LeaderboardEntry.find({})
      .sort({ score: 1 })
      .limit(10); // Optional: limit to top 10

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
