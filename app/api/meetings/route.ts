import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Meeting } from '@/lib/types';

// Generate unique meeting ID
function generateMeetingId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// POST: Create new meeting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, duration } = body;

    const meetingId = generateMeetingId();
    const meeting: Meeting = {
      id: meetingId,
      title: title || '친구 모임',
      description: description || '',
      duration: duration || 60,
      users: [],
      availabilities: []
    };

    // Store in Redis
    await redis.set(`meeting:${meetingId}`, JSON.stringify(meeting));

    return NextResponse.json({ meeting, meetingId });
  } catch (error) {
    console.error('Error creating meeting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to create meeting',
      details: errorMessage,
      help: 'Make sure Redis/KV is set up and REDIS_URL is configured'
    }, { status: 500 });
  }
}

// GET: Get all meetings (for admin purposes)
export async function GET() {
  try {
    // Get all meeting keys
    const keys = await redis.keys('meeting:*');
    const meetings: Record<string, Meeting> = {};

    // Fetch all meetings
    for (const key of keys) {
      const meetingData = await redis.get(key);
      if (meetingData) {
        const meeting = JSON.parse(meetingData);
        meetings[meeting.id] = meeting;
      }
    }

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Error reading meetings:', error);
    return NextResponse.json({ error: 'Failed to read meetings' }, { status: 500 });
  }
}
