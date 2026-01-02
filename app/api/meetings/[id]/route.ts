import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Meeting } from '@/lib/types';

// GET: Get specific meeting
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meetingData = await redis.get(`meeting:${id}`);

    if (!meetingData) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const meeting = JSON.parse(meetingData);

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error('Error reading meeting:', error);
    return NextResponse.json({ error: 'Failed to read meeting' }, { status: 500 });
  }
}

// PUT: Update meeting
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const meetingData = await redis.get(`meeting:${id}`);

    if (!meetingData) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const existingMeeting = JSON.parse(meetingData);

    // Update meeting
    const updatedMeeting = {
      ...existingMeeting,
      ...body,
      id // Ensure ID doesn't change
    };

    await redis.set(`meeting:${id}`, JSON.stringify(updatedMeeting));

    return NextResponse.json({ meeting: updatedMeeting });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}

// DELETE: Delete meeting
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meetingData = await redis.get(`meeting:${id}`);

    if (!meetingData) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await redis.del(`meeting:${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}
