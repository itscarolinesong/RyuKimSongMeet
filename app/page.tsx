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
      alert('Please add at least 2 participants');
      return;
    }

    if (!dateRange.start || !dateRange.end) {
      alert('Please select a date range');
      return;
    }

    if (availabilities.length === 0) {
      alert('Please add availability for at least one participant');
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
            Easy timezone-aware scheduling for friend groups
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meeting Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weekly Catch-up"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Add any additional details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                1. Setup Participants
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'availability'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                2. Add Availability
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'suggestions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                3. Find Times
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
                    Please select a participant from the Setup tab to add their availability
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Adding availability for:{' '}
                        <span className="font-semibold">{currentUser.name}</span>
                        {' '}({currentUser.timezone})
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
                        All Availabilities ({availabilities.length})
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
                      Ready to find the best meeting times?
                    </p>
                    <button
                      onClick={handleFindTimes}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Find Optimal Times
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Meeting Suggestions
                      </h3>
                      <button
                        onClick={handleFindTimes}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                      >
                        Refresh Results
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
                          Add Selected Time to Calendar
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>All times are automatically converted to handle different timezones</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Add recurring weekly availability for each participant</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>The system finds times when the most people are available</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Export to any calendar app with one click</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
