import { DateTime } from 'luxon';

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startUTC: Date;
  endUTC: Date;
  attendees?: string[];
  organizer?: string;
}

/**
 * Formats a date for iCalendar format (YYYYMMDDTHHMMSSZ)
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatICalDate(date: Date): string {
  const dt = DateTime.fromJSDate(date, { zone: 'utc' });
  return dt.toFormat("yyyyMMdd'T'HHmmss'Z'");
}

/**
 * Generates a unique identifier for an event
 * @returns Unique ID
 */
function generateUID(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}@ryukimsonmeet.app`;
}

/**
 * Escapes special characters in iCalendar text fields
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Folds long lines according to iCalendar spec (max 75 characters)
 * @param line - Line to fold
 * @returns Folded line
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const lines: string[] = [];
  let remaining = line;

  while (remaining.length > 75) {
    lines.push(remaining.substring(0, 75));
    remaining = ' ' + remaining.substring(75);
  }

  if (remaining.length > 0) {
    lines.push(remaining);
  }

  return lines.join('\r\n');
}

/**
 * Generates an .ics file content from a calendar event
 * @param event - Calendar event details
 * @returns iCalendar format string
 */
export function generateICS(event: CalendarEvent): string {
  const now = formatICalDate(new Date());
  const start = formatICalDate(event.startUTC);
  const end = formatICalDate(event.endUTC);
  const uid = generateUID();

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RyuKimSongMeet//Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICalText(event.title)}`
  ];

  if (event.description) {
    icsContent.push(
      foldLine(`DESCRIPTION:${escapeICalText(event.description)}`)
    );
  }

  if (event.location) {
    icsContent.push(`LOCATION:${escapeICalText(event.location)}`);
  }

  if (event.organizer) {
    icsContent.push(`ORGANIZER;CN=${escapeICalText(event.organizer)}:mailto:${event.organizer}`);
  }

  if (event.attendees && event.attendees.length > 0) {
    event.attendees.forEach(attendee => {
      icsContent.push(
        `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${escapeICalText(attendee)}:mailto:${attendee}`
      );
    });
  }

  icsContent.push(
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  );

  return icsContent.join('\r\n') + '\r\n';
}

/**
 * Downloads an .ics file
 * @param icsContent - iCalendar format string
 * @param filename - Filename for download
 */
export function downloadICS(icsContent: string, filename: string = 'meeting.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generates calendar URLs for popular calendar services
 * @param event - Calendar event details
 * @returns URLs for different calendar services
 */
export function generateCalendarURLs(event: CalendarEvent): {
  google: string;
  outlook: string;
  yahoo: string;
} {
  const startISO = DateTime.fromJSDate(event.startUTC, { zone: 'utc' }).toISO();
  const endISO = DateTime.fromJSDate(event.endUTC, { zone: 'utc' }).toISO();

  // Google Calendar URL
  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatICalDate(event.startUTC)}/${formatICalDate(event.endUTC)}`,
    details: event.description || '',
    location: event.location || ''
  });
  const google = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

  // Outlook.com URL
  const outlookParams = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startISO || '',
    enddt: endISO || '',
    body: event.description || '',
    location: event.location || ''
  });
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;

  // Yahoo Calendar URL
  const yahooParams = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatICalDate(event.startUTC),
    et: formatICalDate(event.endUTC),
    desc: event.description || '',
    in_loc: event.location || ''
  });
  const yahoo = `https://calendar.yahoo.com/?${yahooParams.toString()}`;

  return { google, outlook, yahoo };
}
