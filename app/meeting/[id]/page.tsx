'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { User, AvailabilityBlock, MeetingOption, Meeting } from '@/lib/types';
import { findOptimalMeetingTimes } from '@/lib/utils/scheduler';
import AvailabilityInput from '@/components/AvailabilityInput';
import AvailabilityList from '@/components/AvailabilityList';
import MeetingSuggestions from '@/components/MeetingSuggestions';
import CalendarExport from '@/components/CalendarExport';
import { COMMON_TIMEZONES, detectUserTimezone } from '@/lib/utils/timezone';

export default function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<MeetingOption[]>([]);
  const [showSuggestionsSection, setShowSuggestionsSection] = useState(false);
  const [selectedOption, setSelectedOption] = useState<MeetingOption | null>(null);
  const [viewerTimezone] = useState(detectUserTimezone());
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // New user form
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserTimezone, setNewUserTimezone] = useState(detectUserTimezone());

  // Load meeting
  useEffect(() => {
    loadMeeting();
  }, [meetingId]);

  const loadMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`);
      if (!response.ok) throw new Error('모임을 찾을 수 없습니다');
      const data = await response.json();
      setMeeting(data.meeting);
    } catch (err) {
      setError(err instanceof Error ? err.message : '모임을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const updateMeeting = async (updates: Partial<Meeting>) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('업데이트 실패');
      const data = await response.json();
      setMeeting(data.meeting);
    } catch (err) {
      alert('업데이트에 실패했습니다');
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim() || !meeting) return;

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newUserName.trim(),
      timezone: newUserTimezone
    };

    await updateMeeting({
      users: [...meeting.users, newUser]
    });

    setCurrentUser(newUser);
    setNewUserName('');
    setShowAddUser(false);
  };

  const handleAddAvailability = async (availability: AvailabilityBlock) => {
    if (!meeting) return;
    await updateMeeting({
      availabilities: [...meeting.availabilities, availability]
    });
  };

  const handleRemoveAvailability = async (index: number) => {
    if (!meeting) return;
    const newAvailabilities = meeting.availabilities.filter((_, i) => i !== index);
    await updateMeeting({
      availabilities: newAvailabilities
    });
  };

  const handleFindTimes = () => {
    if (!meeting) return;

    if (meeting.users.length < 2) {
      alert('최소 2명의 참가자가 필요합니다');
      return;
    }

    if (meeting.availabilities.length === 0) {
      alert('최소 1명의 가능 시간을 추가해주세요');
      return;
    }

    // Get all unique dates from availabilities
    const dates = [...new Set(meeting.availabilities.map(a => a.date))].sort();
    if (dates.length === 0) {
      alert('가능 시간을 추가해주세요');
      return;
    }

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    const options = findOptimalMeetingTimes({
      users: meeting.users,
      availabilities: meeting.availabilities,
      dateRange: { start: startDate, end: endDate },
      duration: meeting.duration,
      minUsers: meeting.users.length, // Require ALL users to be available
      maxOptions: 10
    });

    setSuggestions(options);
    setShowSuggestionsSection(true);

    // Scroll to suggestions section after a brief delay to ensure DOM update
    setTimeout(() => {
      suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다! 친구들에게 공유하세요.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">오류</h2>
          <p className="text-gray-600">{error || '모임을 찾을 수 없습니다'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>
          {meeting.description && (
            <p className="mt-1 text-sm text-gray-600">{meeting.description}</p>
          )}
          <button
            onClick={copyShareLink}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
          >
            📋 링크 복사하여 친구 초대
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* User Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">나는 누구인가요?</h2>

          {!currentUser ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">본인을 선택하거나 새로 추가하세요</p>

              {/* Existing users */}
              {meeting.users.length > 0 && (
                <div className="space-y-2">
                  {meeting.users.map(user => (
                    <button
                      key={user.id}
                      onClick={() => setCurrentUser(user)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">
                        {COMMON_TIMEZONES.find(tz => tz.value === user.timezone)?.label || user.timezone}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Add new user */}
              {!showAddUser ? (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  + 새 참가자로 추가
                </button>
              ) : (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="이름 입력"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      시간대
                    </label>
                    <select
                      value={newUserTimezone}
                      onChange={(e) => setNewUserTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      {COMMON_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserName('');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{currentUser.name}</span>님으로 선택됨
                  <span className="text-blue-600 ml-2">({COMMON_TIMEZONES.find(tz => tz.value === currentUser.timezone)?.label})</span>
                </p>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                다른 사람으로 변경
              </button>
            </div>
          )}
        </div>

        {/* Availability Input */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">내 가능 시간 추가</h2>
            <AvailabilityInput
              userId={currentUser.id}
              onAdd={handleAddAvailability}
            />
          </div>
        )}

        {/* All Availabilities */}
        {meeting.availabilities.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              모든 가능 시간 ({meeting.availabilities.length}개)
            </h2>
            <AvailabilityList
              availabilities={meeting.availabilities}
              users={meeting.users}
              onRemove={handleRemoveAvailability}
            />
          </div>
        )}

        {/* Find Times Button */}
        {meeting.availabilities.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={handleFindTimes}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              최적 시간 찾기
            </button>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestionsSection && (
          <div ref={suggestionsRef} className="bg-white rounded-lg shadow-md p-6">
            <MeetingSuggestions
              suggestions={suggestions}
              users={meeting.users}
              viewerTimezone={viewerTimezone}
              onSelect={setSelectedOption}
              selectedOption={selectedOption}
            />
          </div>
        )}

        {/* Calendar Export */}
        {selectedOption && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              선택한 시간 캘린더에 추가
            </h3>
            <CalendarExport
              meetingOption={selectedOption}
              meetingTitle={meeting.title}
              meetingDescription={meeting.description}
            />
          </div>
        )}
      </main>
    </div>
  );
}
