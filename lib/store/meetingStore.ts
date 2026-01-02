import { create } from 'zustand';
import { User, AvailabilityBlock, MeetingOption } from '@/lib/types';
import { detectUserTimezone } from '@/lib/utils/timezone';

interface MeetingState {
  // Meeting details
  meetingTitle: string;
  meetingDescription: string;
  meetingDuration: number; // in minutes

  // Users
  users: User[];
  currentUser: User | null;

  // Availabilities
  availabilities: AvailabilityBlock[];

  // Date range
  dateRange: {
    start: Date | null;
    end: Date | null;
  };

  // Suggestions
  suggestions: MeetingOption[];
  selectedOption: MeetingOption | null;

  // UI state
  viewerTimezone: string;

  // Actions
  setMeetingTitle: (title: string) => void;
  setMeetingDescription: (description: string) => void;
  setMeetingDuration: (duration: number) => void;

  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  setCurrentUser: (user: User | null) => void;

  addAvailability: (availability: AvailabilityBlock) => void;
  removeAvailability: (index: number) => void;
  updateAvailability: (index: number, updates: Partial<AvailabilityBlock>) => void;
  clearAvailabilities: (userId: string) => void;

  setDateRange: (start: Date | null, end: Date | null) => void;

  setSuggestions: (suggestions: MeetingOption[]) => void;
  selectOption: (option: MeetingOption | null) => void;

  setViewerTimezone: (timezone: string) => void;

  reset: () => void;
}

const initialState = {
  meetingTitle: '친구 모임',
  meetingDescription: '',
  meetingDuration: 60,
  users: [],
  currentUser: null,
  availabilities: [],
  dateRange: {
    start: null,
    end: null
  },
  suggestions: [],
  selectedOption: null,
  viewerTimezone: detectUserTimezone()
};

export const useMeetingStore = create<MeetingState>((set) => ({
  ...initialState,

  setMeetingTitle: (title) => set({ meetingTitle: title }),

  setMeetingDescription: (description) => set({ meetingDescription: description }),

  setMeetingDuration: (duration) => set({ meetingDuration: duration }),

  addUser: (user) => set((state) => ({
    users: [...state.users, user]
  })),

  removeUser: (userId) => set((state) => ({
    users: state.users.filter(u => u.id !== userId),
    availabilities: state.availabilities.filter(a => a.userId !== userId)
  })),

  updateUser: (userId, updates) => set((state) => ({
    users: state.users.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    )
  })),

  setCurrentUser: (user) => set({ currentUser: user }),

  addAvailability: (availability) => set((state) => ({
    availabilities: [...state.availabilities, availability]
  })),

  removeAvailability: (index) => set((state) => ({
    availabilities: state.availabilities.filter((_, i) => i !== index)
  })),

  updateAvailability: (index, updates) => set((state) => ({
    availabilities: state.availabilities.map((a, i) =>
      i === index ? { ...a, ...updates } : a
    )
  })),

  clearAvailabilities: (userId) => set((state) => ({
    availabilities: state.availabilities.filter(a => a.userId !== userId)
  })),

  setDateRange: (start, end) => set({
    dateRange: { start, end }
  }),

  setSuggestions: (suggestions) => set({ suggestions }),

  selectOption: (option) => set({ selectedOption: option }),

  setViewerTimezone: (timezone) => set({ viewerTimezone: timezone }),

  reset: () => set(initialState)
}));
