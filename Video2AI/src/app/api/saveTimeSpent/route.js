import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TimeEntry from '@/models/TimeEntry';

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, page, durationSeconds, timestamp } = await req.json();
    console.log('TrackTime:', userId, page, durationSeconds, timestamp);

    
    if (!userId || !page || typeof durationSeconds !== 'number') {
      return NextResponse.json(
        { error: 'All fields are required and durationSeconds must be a number' },
        { status: 400 }
      );
    }

    const entry = new TimeEntry({
      userId,
      page,
      durationSeconds,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    await entry.save();

    return NextResponse.json({ message: 'Time entry saved successfully', entry }, { status: 201 });
  } catch (error) {
    console.error('Error saving time entry:', error);
    return NextResponse.json({ error: 'Failed to save time entry' }, { status: 500 });
  }
}
