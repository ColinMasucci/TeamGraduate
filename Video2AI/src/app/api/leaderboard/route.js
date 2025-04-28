import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LeaderboardEntry from '@/models/LeaderboardEntry'; // Adjust this to match your actual model name

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('videoUrl');
    console.log('Retrieve Leaderboard', videoUrl);
    
    if (!videoUrl || videoUrl == "" || videoUrl == null) {
      return NextResponse.json({ error: 'Url is required and cannot be Null or blank' }, { status: 400 });
    }


    // Fetch leaderboard entries, sorted by score descending
    const leaderboard = await LeaderboardEntry.find({videoUrl})
      .sort({ score: 1 })
      .limit(10); // Optional: limit to top 10

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
