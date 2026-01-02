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

// GET: Get specific meeting
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meetings = await readMeetings();
    const meeting = meetings[id];

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

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
    const meetings = await readMeetings();

    if (!meetings[id]) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Update meeting
    meetings[id] = {
      ...meetings[id],
      ...body,
      id // Ensure ID doesn't change
    };

    await writeMeetings(meetings);

    return NextResponse.json({ meeting: meetings[id] });
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
    const meetings = await readMeetings();

    if (!meetings[id]) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    delete meetings[id];
    await writeMeetings(meetings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}
