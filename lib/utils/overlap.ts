import { TimeSlot, MeetingOption, User, UserPreferences } from '@/lib/types';
import { DateTime } from 'luxon';
import { isReasonableHour } from './timezone';

interface TimePoint {
  time: Date;
  type: 'start' | 'end';
  userId: string;
}

/**
 * Finds overlapping time slots among multiple users
 * @param timeSlots - Array of time slots from all users
 * @param minUsers - Minimum number of users required for a valid overlap
 * @returns Array of overlapping time periods with participating users
 */
export function findOverlappingSlots(
  timeSlots: TimeSlot[],
  minUsers: number = 2
): Array<{ start: Date; end: Date; userIds: string[] }> {
  if (timeSlots.length === 0) return [];

  // Create time points for sweep line algorithm
  const timePoints: TimePoint[] = [];

  timeSlots.forEach(slot => {
    timePoints.push({ time: slot.start, type: 'start', userId: slot.userId });
    timePoints.push({ time: slot.end, type: 'end', userId: slot.userId });
  });

  // Sort by time, with 'start' events before 'end' events at the same time
  timePoints.sort((a, b) => {
    const timeDiff = a.time.getTime() - b.time.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.type === 'start' ? -1 : 1;
  });

  const overlaps: Array<{ start: Date; end: Date; userIds: string[] }> = [];
  const activeUsers = new Set<string>();
  let lastTime: Date | null = null;

  for (const point of timePoints) {
    // If we have enough users and time has passed, record the overlap
    if (
      lastTime &&
      activeUsers.size >= minUsers &&
      point.time.getTime() > lastTime.getTime()
    ) {
      overlaps.push({
        start: lastTime,
        end: point.time,
        userIds: Array.from(activeUsers)
      });
    }

    // Update active users
    if (point.type === 'start') {
      activeUsers.add(point.userId);
    } else {
      activeUsers.delete(point.userId);
    }

    lastTime = point.time;
  }

  return overlaps;
}

/**
 * Generates meeting options from overlapping slots
 * @param overlaps - Overlapping time periods
 * @param duration - Meeting duration in minutes
 * @param users - Array of users with their preferences
 * @param userPreferences - Map of user preferences
 * @returns Array of meeting options
 */
export function generateMeetingOptions(
  overlaps: Array<{ start: Date; end: Date; userIds: string[] }>,
  duration: number,
  users: User[],
  userPreferences?: Map<string, UserPreferences>
): MeetingOption[] {
  const options: MeetingOption[] = [];

  for (const overlap of overlaps) {
    const overlapDuration =
      (overlap.end.getTime() - overlap.start.getTime()) / (1000 * 60); // in minutes

    if (overlapDuration < duration) continue;

    // Generate time slots within this overlap period
    const slotStart = DateTime.fromJSDate(overlap.start);
    const slotEnd = DateTime.fromJSDate(overlap.end);
    let currentStart = slotStart;

    while (currentStart.plus({ minutes: duration }) <= slotEnd) {
      const meetingStart = currentStart.toJSDate();
      const meetingEnd = currentStart.plus({ minutes: duration }).toJSDate();

      // Check if this time is reasonable for all participating users
      let isReasonable = true;
      if (userPreferences) {
        for (const userId of overlap.userIds) {
          const user = users.find(u => u.id === userId);
          const prefs = userPreferences.get(userId);

          if (user && prefs?.avoidUnreasonableHours) {
            const earliestHour = prefs.earliestHour ?? 8;
            const latestHour = prefs.latestHour ?? 22;

            if (
              !isReasonableHour(meetingStart, user.timezone, earliestHour, latestHour) ||
              !isReasonableHour(meetingEnd, user.timezone, earliestHour, latestHour)
            ) {
              isReasonable = false;
              break;
            }
          }
        }
      }

      if (isReasonable) {
        options.push({
          startUTC: meetingStart,
          endUTC: meetingEnd,
          availableUsers: overlap.userIds,
          score: overlap.userIds.length
        });
      }

      // Move to next potential slot (30 minute increments)
      currentStart = currentStart.plus({ minutes: 30 });
    }
  }

  return options;
}

/**
 * Ranks meeting options by score and time
 * @param options - Array of meeting options
 * @param limit - Maximum number of options to return
 * @returns Top N meeting options
 */
export function rankMeetingOptions(
  options: MeetingOption[],
  limit: number = 10
): MeetingOption[] {
  return options
    .sort((a, b) => {
      // First sort by score (more users = better)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Then by time (earlier = better)
      return a.startUTC.getTime() - b.startUTC.getTime();
    })
    .slice(0, limit);
}

/**
 * Checks if two time ranges overlap
 * @param start1 - Start of first range
 * @param end1 - End of first range
 * @param start2 - Start of second range
 * @param end2 - End of second range
 * @returns boolean indicating if ranges overlap
 */
export function doTimeRangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Merges consecutive or overlapping time slots for the same user
 * @param slots - Array of time slots
 * @returns Merged array of time slots
 */
export function mergeTimeSlots(slots: TimeSlot[]): TimeSlot[] {
  if (slots.length === 0) return [];

  // Group by user
  const slotsByUser = new Map<string, TimeSlot[]>();
  slots.forEach(slot => {
    if (!slotsByUser.has(slot.userId)) {
      slotsByUser.set(slot.userId, []);
    }
    slotsByUser.get(slot.userId)!.push(slot);
  });

  const merged: TimeSlot[] = [];

  // Merge slots for each user
  slotsByUser.forEach((userSlots, userId) => {
    // Sort by start time
    userSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    let current = userSlots[0];

    for (let i = 1; i < userSlots.length; i++) {
      const next = userSlots[i];

      // Check if slots overlap or are adjacent
      if (next.start <= current.end) {
        // Merge by extending current slot
        current = {
          ...current,
          end: new Date(Math.max(current.end.getTime(), next.end.getTime()))
        };
      } else {
        // No overlap, push current and start new
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
  });

  return merged;
}
