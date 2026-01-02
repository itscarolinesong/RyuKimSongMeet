'use client';

import { useState } from 'react';
import { useMeetingStore } from '@/lib/store/meetingStore';
import { findOptimalMeetingTimes } from '@/lib/utils/scheduler';
import UserManager from '@/components/UserManager';
import AvailabilityInput from '@/components/AvailabilityInput';
import AvailabilityList from '@/components/AvailabilityList';
import MeetingSuggestions from '@/components/MeetingSuggestions';
import CalendarExport from '@/components/CalendarExport';

export default function Home() {
  const {
    meetingTitle,
    meetingDescription,
    meetingDuration,
    users,
    currentUser,
    availabilities,
    dateRange,
    suggestions,
    selectedOption,
    viewerTimezone,
    setMeetingTitle,
    setMeetingDescription,
    setMeetingDuration,
    addUser,
    removeUser,
    setCurrentUser,
    addAvailability,
    removeAvailability,
    setDateRange,
    setSuggestions,
    selectOption
  } = useMeetingStore();

  const [activeTab, setActiveTab] = useState<'setup' | 'availability' | 'suggestions'>('setup');

  const handleFindTimes = () => {
    if (users.length < 2) {
      alert('최소 2명의 참가자를 추가해주세요');
      return;
    }

    if (!dateRange.start || !dateRange.end) {
      alert('날짜 범위를 선택해주세요');
      return;
    }

    if (availabilities.length === 0) {
      alert('최소 1명의 참가자에 대한 가능 시간을 추가해주세요');
      return;
    }

    const options = findOptimalMeetingTimes({
      users,
      availabilities,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end
      },
      duration: meetingDuration,
      minUsers: 2,
      maxOptions: 10
    });

    setSuggestions(options);
    setActiveTab('suggestions');
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : null;
    if (type === 'start') {
      setDateRange(date, dateRange.end);
    } else {
      setDateRange(dateRange.start, date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">RyuKimSongMeet</h1>
          <p className="mt-1 text-sm text-gray-600">
            친구들과의 쉬운 시간대 맞춤 일정 조율
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meeting Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">모임 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                모임 제목
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="예: 주간 모임"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                소요 시간
              </label>
              <select
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value={30}>30분</option>
                <option value={60}>1시간</option>
                <option value={90}>1시간 30분</option>
                <option value={120}>2시간</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                설명 (선택사항)
              </label>
              <textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                rows={2}
                placeholder="추가 정보 입력..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                검색 시작 날짜
              </label>
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                검색 종료 날짜
              </label>
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'setup'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                1. 참가자 설정
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'availability'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                2. 가능 시간 추가
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'suggestions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                3. 시간 찾기
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'setup' && (
              <UserManager
                users={users}
                onAddUser={addUser}
                onRemoveUser={removeUser}
                onSelectUser={setCurrentUser}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'availability' && (
              <div className="space-y-6">
                {!currentUser ? (
                  <div className="text-center py-8 text-gray-500">
                    참가자 설정 탭에서 참가자를 선택하여 가능 시간을 추가해주세요
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">{currentUser.name}</span>님의 가능 시간 추가 중
                        <span className="text-blue-600"> ({currentUser.timezone})</span>
                      </p>
                    </div>

                    <AvailabilityInput
                      userId={currentUser.id}
                      onAdd={(availability) => {
                        addAvailability(availability);
                      }}
                    />

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        전체 가능 시간 ({availabilities.length}개)
                      </h3>
                      <AvailabilityList
                        availabilities={availabilities}
                        users={users}
                        onRemove={removeAvailability}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      최적의 회의 시간을 찾을 준비가 되셨나요?
                    </p>
                    <button
                      onClick={handleFindTimes}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      최적 시간 찾기
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        회의 추천 시간
                      </h3>
                      <button
                        onClick={handleFindTimes}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                      >
                        결과 새로고침
                      </button>
                    </div>

                    <MeetingSuggestions
                      suggestions={suggestions}
                      users={users}
                      viewerTimezone={viewerTimezone}
                      onSelect={selectOption}
                      selectedOption={selectedOption}
                    />

                    {selectedOption && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          선택한 시간 캘린더에 추가
                        </h3>
                        <CalendarExport
                          meetingOption={selectedOption}
                          meetingTitle={meetingTitle}
                          meetingDescription={meetingDescription}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">사용 팁</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>모든 시간은 자동으로 변환되어 다른 시간대를 처리합니다</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>각 참가자의 특정 날짜별 가능 시간을 추가하세요</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>시스템이 가장 많은 사람이 가능한 시간을 찾아줍니다</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>원클릭으로 모든 캘린더 앱에 내보낼 수 있습니다</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
