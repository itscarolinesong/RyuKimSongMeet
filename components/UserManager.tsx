'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { COMMON_TIMEZONES, detectUserTimezone } from '@/lib/utils/timezone';

interface UserManagerProps {
  users: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (userId: string) => void;
  onSelectUser: (user: User) => void;
  currentUser: User | null;
}

export default function UserManager({
  users,
  onAddUser,
  onRemoveUser,
  onSelectUser,
  currentUser
}: UserManagerProps) {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(detectUserTimezone());
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('이름을 입력해주세요');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      timezone
    };

    onAddUser(newUser);
    setName('');
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">참가자</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          {showForm ? '취소' : '+ 사람 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-900 mb-1">
              시간대
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            참가자 추가
          </button>
        </form>
      )}

      <div className="space-y-2">
        {users.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            아직 참가자가 없습니다. 추가해주세요!
          </div>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                currentUser?.id === user.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">
                  {COMMON_TIMEZONES.find(tz => tz.value === user.timezone)?.label || user.timezone}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectUser(user)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentUser?.id === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {currentUser?.id === user.id ? '선택됨' : '선택'}
                </button>
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="text-red-500 hover:text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
