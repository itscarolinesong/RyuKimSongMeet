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
 * Converts an availability block to UTC time slot
 * @param block - Availability block with local times and specific date
 * @param timezone - User's timezone
 * @returns TimeSlot in UTC
 */
export function availabilityBlockToUTCSlots(
  block: AvailabilityBlock,
  timezone: string,
  startDate?: Date,
  endDate?: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Parse the date from the block
  const [year, month, day] = block.date.split('-').map(Number);
  const [startHour, startMinute] = block.startTimeLocal.split(':').map(Number);
  const [endHour, endMinute] = block.endTimeLocal.split(':').map(Number);

  // Create DateTime in user's local timezone
  const slotStart = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour: startHour,
      minute: startMinute,
      second: 0,
      millisecond: 0
    },
    { zone: timezone }
  ).toUTC();

  const slotEnd = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0
    },
    { zone: timezone }
  ).toUTC();

  slots.push({
    start: slotStart.toJSDate(),
    end: slotEnd.toJSDate(),
    userId: block.userId
  });

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
 * Get a list of common timezones with labels in Korean
 */
export const COMMON_TIMEZONES = [
  { value: 'Asia/Seoul', label: '서울 (KST)' },
  { value: 'America/New_York', label: '뉴욕 (동부 시간)' },
  { value: 'America/Chicago', label: '시카고 (중부 시간)' },
  { value: 'America/Denver', label: '덴버 (산악 시간)' },
  { value: 'America/Los_Angeles', label: '로스앤젤레스 (태평양 시간)' },
  { value: 'America/Anchorage', label: '앵커리지 (알래스카)' },
  { value: 'Pacific/Honolulu', label: '호놀룰루 (하와이)' },
  { value: 'Europe/London', label: '런던 (GMT/BST)' },
  { value: 'Europe/Paris', label: '파리 (CET/CEST)' },
  { value: 'Europe/Berlin', label: '베를린 (CET/CEST)' },
  { value: 'Asia/Tokyo', label: '도쿄 (JST)' },
  { value: 'Asia/Shanghai', label: '상하이 (CST)' },
  { value: 'Asia/Hong_Kong', label: '홍콩 (HKT)' },
  { value: 'Asia/Singapore', label: '싱가포르 (SGT)' },
  { value: 'Asia/Dubai', label: '두바이 (GST)' },
  { value: 'Australia/Sydney', label: '시드니 (AEDT/AEST)' },
  { value: 'Pacific/Auckland', label: '오클랜드 (NZDT/NZST)' },
];
