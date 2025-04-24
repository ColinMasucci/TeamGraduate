import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transcript from '@/models/Transcript';

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, videoUrl, transcript } = await req.json();
    console.log('saveTranscript', userId, videoUrl);

    if (!userId || !videoUrl || !transcript) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updatedTranscript = await Transcript.findOneAndUpdate(
        { videoUrl },
        { transcript, createdAt: new Date() },
        { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: 'Transcript saved successfully', transcript: updatedTranscript },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving transcript:', error);
    return NextResponse.json({ error: 'Failed to save transcript' }, { status: 500 });
  }
}
