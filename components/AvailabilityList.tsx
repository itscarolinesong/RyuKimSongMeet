'use client';

import { AvailabilityBlock, User } from '@/lib/types';

interface AvailabilityListProps {
  availabilities: AvailabilityBlock[];
  users: User[];
  onRemove: (index: number) => void;
}

export default function AvailabilityList({
  availabilities,
  users,
  onRemove
}: AvailabilityListProps) {
  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 추가된 시간이 없습니다... ㅠㅠ)
      </div>
    );
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '당신은 누구인가';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
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
            <div className="text-sm text-gray-700 mt-1">
              {formatDate(availability.date)}
            </div>
            <div className="text-sm text-gray-600">
              {availability.startTimeLocal} - {availability.endTimeLocal}
            </div>
          </div>

          <button
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded transition-colors"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
