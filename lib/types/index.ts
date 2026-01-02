export interface User {
  id: string;
  name: string;
  timezone: string; // IANA timezone, e.g., "Asia/Seoul", "America/New_York"
}

export interface AvailabilityBlock {
  userId: string;
  dayOfWeek: number; // 0 (Sunday) - 6 (Saturday)
  startTimeLocal: string; // "HH:mm" format, e.g., "19:00"
  endTimeLocal: string; // "HH:mm" format, e.g., "22:00"
}

export interface MeetingOption {
  startUTC: Date;
  endUTC: Date;
  availableUsers: string[]; // Array of user IDs
  score: number; // Number of available users
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  duration: number; // Duration in minutes
  users: User[];
  availabilities: AvailabilityBlock[];
  selectedOption?: MeetingOption;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TimeSlot {
  start: Date; // UTC
  end: Date; // UTC
  userId: string;
}

export interface UserPreferences {
  avoidUnreasonableHours?: boolean;
  earliestHour?: number; // 0-23, default 8
  latestHour?: number; // 0-23, default 22
}
