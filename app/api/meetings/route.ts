import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Meeting } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEETINGS_FILE = path.join(DATA_DIR, 'meetings.json');

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(MEETINGS_FILE);
  } catch {
    await fs.writeFile(MEETINGS_FILE, JSON.stringify({}), 'utf-8');
  }
}

// Read all meetings
async function readMeetings(): Promise<Record<string, Meeting>> {
  await ensureDataFile();
  const data = await fs.readFile(MEETINGS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write all meetings
async function writeMeetings(meetings: Record<string, Meeting>) {
  await ensureDataFile();
  await fs.writeFile(MEETINGS_FILE, JSON.stringify(meetings, null, 2), 'utf-8');
}

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

    const meetings = await readMeetings();
    meetings[meetingId] = meeting;
    await writeMeetings(meetings);

    return NextResponse.json({ meeting, meetingId });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

// GET: Get all meetings (for admin purposes)
export async function GET() {
  try {
    const meetings = await readMeetings();
    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Error reading meetings:', error);
    return NextResponse.json({ error: 'Failed to read meetings' }, { status: 500 });
  }
}
