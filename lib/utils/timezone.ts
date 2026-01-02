import { DateTime } from 'luxon';
import { AvailabilityBlock, TimeSlot } from '@/lib/types';

/**
 * Converts a local time string (HH:mm) on a specific day to UTC
 * @param dayOfWeek - 0 (Sunday) to 6 (Saturday)
 * @param timeLocal - Time string in "HH:mm" format
 * @param timezone - IANA timezone string
 * @param referenceDate - Reference date to calculate from (defaults to next occurrence of dayOfWeek)
 * @returns DateTime object in UTC
 */
export function convertLocalToUTC(
  dayOfWeek: number,
  timeLocal: string,
  timezone: string,
  referenceDate?: Date
): DateTime {
  const [hours, minutes] = timeLocal.split(':').map(Number);

  // Use reference date or current date
  const now = referenceDate ? DateTime.fromJSDate(referenceDate, { zone: timezone }) : DateTime.now().setZone(timezone);

  // Find the next occurrence of the specified day of week
  let targetDate = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  // Calculate days until target day of week
  const currentDayOfWeek = targetDate.weekday === 7 ? 0 : targetDate.weekday; // Luxon uses 1-7 (Mon-Sun), we use 0-6 (Sun-Sat)
  const daysUntilTarget = (dayOfWeek - currentDayOfWeek + 7) % 7;

  if (daysUntilTarget > 0) {
    targetDate = targetDate.plus({ days: daysUntilTarget });
  }

  return targetDate.toUTC();
}

/**
 * Converts UTC DateTime to local time in specified timezone
 * @param utcDate - Date in UTC
 * @param timezone - IANA timezone string
 * @returns DateTime object in local timezone
 */
export function convertUTCToLocal(utcDate: Date, timezone: string): DateTime {
  return DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone);
}

/**
 * Converts an availability block to UTC time slots for a given date range
 * @param block - Availability block with local times
 * @param timezone - User's timezone
 * @param startDate - Start of date range to generate slots
 * @param endDate - End of date range to generate slots
 * @returns Array of time slots in UTC
 */
export function availabilityBlockToUTCSlots(
  block: AvailabilityBlock,
  timezone: string,
  startDate: Date,
  endDate: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = DateTime.fromJSDate(startDate, { zone: timezone });
  const end = DateTime.fromJSDate(endDate, { zone: timezone });

  let current = start.startOf('day');

  while (current <= end) {
    const currentDayOfWeek = current.weekday === 7 ? 0 : current.weekday;

    if (currentDayOfWeek === block.dayOfWeek) {
      const [startHour, startMinute] = block.startTimeLocal.split(':').map(Number);
      const [endHour, endMinute] = block.endTimeLocal.split(':').map(Number);

      const slotStart = current.set({
        hour: startHour,
        minute: startMinute,
        second: 0,
        millisecond: 0
      }).toUTC();

      const slotEnd = current.set({
        hour: endHour,
        minute: endMinute,
        second: 0,
        millisecond: 0
      }).toUTC();

      slots.push({
        start: slotStart.toJSDate(),
        end: slotEnd.toJSDate(),
        userId: block.userId
      });
    }

    current = current.plus({ days: 1 });
  }

  return slots;
}

/**
 * Detects user's timezone
 * @returns IANA timezone string
 */
export function detectUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Formats a UTC date for display in a specific timezone
 * @param utcDate - Date in UTC
 * @param timezone - IANA timezone string
 * @param format - Format string (defaults to human-readable)
 * @returns Formatted date string
 */
export function formatInTimezone(
  utcDate: Date,
  timezone: string,
  format: string = 'fff'
): string {
  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone);
  return dt.toFormat(format);
}

/**
 * Checks if a time is within reasonable hours (8am - 10pm) in a given timezone
 * @param utcDate - Date in UTC
 * @param timezone - IANA timezone string
 * @param earliestHour - Earliest acceptable hour (default 8)
 * @param latestHour - Latest acceptable hour (default 22)
 * @returns boolean
 */
export function isReasonableHour(
  utcDate: Date,
  timezone: string,
  earliestHour: number = 8,
  latestHour: number = 22
): boolean {
  const local = convertUTCToLocal(utcDate, timezone);
  const hour = local.hour;
  return hour >= earliestHour && hour < latestHour;
}

/**
 * Get a list of common timezones with labels
 */
export const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'America/Anchorage', label: 'Alaska Time' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
];
