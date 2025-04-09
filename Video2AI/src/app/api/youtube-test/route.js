// /app/api/youtube-test/route.js or route.ts
import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

export async function GET() {
  const testUrl = 'https://www.youtube.com/watch?v=grod-PDmoBs'; 

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(testUrl);
    return NextResponse.json({ success: true, transcript });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    }, { status: 500 });
  }
}
