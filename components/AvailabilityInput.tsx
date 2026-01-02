'use client';

import { useState } from 'react';
import { AvailabilityBlock } from '@/lib/types';

interface AvailabilityInputProps {
  userId: string;
  onAdd: (availability: AvailabilityBlock) => void;
}

export default function AvailabilityInput({ userId, onAdd }: AvailabilityInputProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!date) {
      alert('날짜를 선택해주세요');
      return;
    }

    if (startTime >= endTime) {
      alert('시작 시간은 종료 시간보다 빨라야 합니다');
      return;
    }

    const availability: AvailabilityBlock = {
      userId,
      date,
      startTimeLocal: startTime,
      endTimeLocal: endTime
    };

    onAdd(availability);

    // Reset time but keep date for easier multiple entries
    setStartTime('09:00');
    setEndTime('17:00');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-900 mb-1">
          날짜
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-900 mb-1">
            시작 시간
          </label>
          <input
            type="time"
            id="start"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-900 mb-1">
            종료 시간
          </label>
          <input
            type="time"
            id="end"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        가능 시간 추가
      </button>
    </form>
  );
}
