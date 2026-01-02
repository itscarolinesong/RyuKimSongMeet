'use client';

import { AvailabilityBlock, User } from '@/lib/types';

interface AvailabilityListProps {
  availabilities: AvailabilityBlock[];
  users: User[];
  onRemove: (index: number) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailabilityList({
  availabilities,
  users,
  onRemove
}: AvailabilityListProps) {
  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No availability blocks added yet
      </div>
    );
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  return (
    <div className="space-y-2">
      {availabilities.map((availability, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {getUserName(availability.userId)}
            </div>
            <div className="text-sm text-gray-600">
              {DAYS[availability.dayOfWeek]} • {availability.startTimeLocal} - {availability.endTimeLocal}
            </div>
          </div>

          <button
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
