import {
  User,
  AvailabilityBlock,
  MeetingOption,
  TimeSlot,
  UserPreferences
} from '@/lib/types';
import { availabilityBlockToUTCSlots } from './timezone';
import {
  findOverlappingSlots,
  generateMeetingOptions,
  rankMeetingOptions,
  mergeTimeSlots
} from './overlap';

export interface SchedulerConfig {
  users: User[];
  availabilities: AvailabilityBlock[];
  dateRange: {
    start: Date;
    end: Date;
  };
  duration: number; // in minutes
  minUsers?: number;
  userPreferences?: Map<string, UserPreferences>;
  maxOptions?: number;
}

/**
 * Main scheduler function that finds optimal meeting times
 * @param config - Scheduler configuration
 * @returns Array of ranked meeting options
 */
export function findOptimalMeetingTimes(config: SchedulerConfig): MeetingOption[] {
  const {
    users,
    availabilities,
    dateRange,
    duration,
    minUsers = 2,
    userPreferences,
    maxOptions = 10
  } = config;

  // Step 1: Convert all availability blocks to UTC time slots
  const allTimeSlots: TimeSlot[] = [];

  availabilities.forEach(block => {
    const user = users.find(u => u.id === block.userId);
    if (!user) return;

    const slots = availabilityBlockToUTCSlots(
      block,
      user.timezone,
      dateRange.start,
      dateRange.end
    );

    allTimeSlots.push(...slots);
  });

  // Step 2: Merge overlapping slots for each user
  const mergedSlots = mergeTimeSlots(allTimeSlots);

  // Step 3: Find overlapping periods among users
  const overlaps = findOverlappingSlots(mergedSlots, minUsers);

  // Step 4: Generate meeting options from overlaps
  const options = generateMeetingOptions(
    overlaps,
    duration,
    users,
    userPreferences
  );

  // Step 5: Rank and return top options
  return rankMeetingOptions(options, maxOptions);
}

/**
 * Validates availability blocks
 * @param blocks - Array of availability blocks
 * @returns Validation errors or null if valid
 */
export function validateAvailabilities(
  blocks: AvailabilityBlock[]
): string[] | null {
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    // Validate day of week
    if (block.dayOfWeek < 0 || block.dayOfWeek > 6) {
      errors.push(
        `Block ${index}: dayOfWeek must be between 0 (Sunday) and 6 (Saturday)`
      );
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(block.startTimeLocal)) {
      errors.push(
        `Block ${index}: startTimeLocal must be in HH:mm format (00:00-23:59)`
      );
    }
    if (!timeRegex.test(block.endTimeLocal)) {
      errors.push(
        `Block ${index}: endTimeLocal must be in HH:mm format (00:00-23:59)`
      );
    }

    // Validate that start is before end
    const [startHour, startMin] = block.startTimeLocal.split(':').map(Number);
    const [endHour, endMin] = block.endTimeLocal.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      errors.push(
        `Block ${index}: startTimeLocal must be before endTimeLocal`
      );
    }
  });

  return errors.length > 0 ? errors : null;
}

/**
 * Gets a summary of availability coverage
 * @param availabilities - Array of availability blocks
 * @param users - Array of users
 * @returns Coverage summary
 */
export function getAvailabilitySummary(
  availabilities: AvailabilityBlock[],
  users: User[]
): {
  totalBlocks: number;
  userCoverage: Map<string, number>;
  dayCoverage: Map<number, number>;
} {
  const userCoverage = new Map<string, number>();
  const dayCoverage = new Map<number, number>();

  users.forEach(user => userCoverage.set(user.id, 0));
  for (let i = 0; i < 7; i++) {
    dayCoverage.set(i, 0);
  }

  availabilities.forEach(block => {
    userCoverage.set(block.userId, (userCoverage.get(block.userId) || 0) + 1);
    dayCoverage.set(block.dayOfWeek, (dayCoverage.get(block.dayOfWeek) || 0) + 1);
  });

  return {
    totalBlocks: availabilities.length,
    userCoverage,
    dayCoverage
  };
}
