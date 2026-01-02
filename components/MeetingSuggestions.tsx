'use client';

import { MeetingOption, User } from '@/lib/types';
import { DateTime } from 'luxon';

interface MeetingSuggestionsProps {
  suggestions: MeetingOption[];
  users: User[];
  viewerTimezone: string;
  onSelect: (option: MeetingOption) => void;
  selectedOption: MeetingOption | null;
}

export default function MeetingSuggestions({
  suggestions,
  users,
  viewerTimezone,
  onSelect,
  selectedOption
}: MeetingSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        우리 못 만나.... 되는 시간 추가하고 날짜 범위를 설정해주세요!
      </div>
    );
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '당신은 누구인가';
  };

  const formatTimeRange = (start: Date, end: Date, timezone: string) => {
    const startDt = DateTime.fromJSDate(start, { zone: 'utc' }).setZone(timezone);
    const endDt = DateTime.fromJSDate(end, { zone: 'utc' }).setZone(timezone);

    const dateStr = startDt.toFormat('M월 d일 (EEE)', { locale: 'ko' });
    const startTime = startDt.toFormat('a h:mm', { locale: 'ko' });
    const endTime = endDt.toFormat('a h:mm', { locale: 'ko' });
    const tzAbbr = startDt.toFormat('ZZZZ');

    return `${dateStr} • ${startTime} - ${endTime} ${tzAbbr}`;
  };

  const getLocalTimeForUser = (date: Date, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return '';

    const dt = DateTime.fromJSDate(date, { zone: 'utc' }).setZone(user.timezone);
    return dt.toFormat('a h:mm', { locale: 'ko' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        두둥! 우리는 언제 만날 수 있냐면... ({suggestions.length}개)
      </h3>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const isSelected = selectedOption?.startUTC.getTime() === suggestion.startUTC.getTime();

          return (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'bg-green-50 border-green-500 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => onSelect(suggestion)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {formatTimeRange(suggestion.startUTC, suggestion.endUTC, viewerTimezone)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {suggestion.availableUsers.length}명 참가 가능
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                    선택됨
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  각자 현지 시간:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestion.availableUsers.map(userId => (
                    <div key={userId} className="text-sm text-gray-700">
                      <span className="font-medium">{getUserName(userId)}:</span>{' '}
                      {getLocalTimeForUser(suggestion.startUTC, userId)}
                    </div>
                  ))}
                </div>
              </div>

              {!isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(suggestion);
                  }}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                >
                  요때 만나자!!!!
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
