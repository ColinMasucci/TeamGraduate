import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import Transcript from '@/models/Transcript';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('videoUrl');

  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing videoUrl parameter' }, { status: 400 });
  }

  try {
    const transcriptDoc = await Transcript.findOne({ videoUrl });

    if (!transcriptDoc) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    //const publicPath = path.join(process.cwd(), 'public', 'dynamic-transcript.txt');
    //await fs.writeFile(publicPath, transcriptDoc.transcript, 'utf-8');

    return NextResponse.json({ message: 'Transcript fetched', transcript: transcriptDoc.transcript });
  } catch (error) {
    console.error('Error fetching/saving transcript:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
