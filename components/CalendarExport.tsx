'use client';

import { MeetingOption } from '@/lib/types';
import { generateICS, downloadICS, generateCalendarURLs, CalendarEvent } from '@/lib/utils/calendar';
import { useState } from 'react';

interface CalendarExportProps {
  meetingOption: MeetingOption;
  meetingTitle: string;
  meetingDescription?: string;
}

export default function CalendarExport({
  meetingOption,
  meetingTitle,
  meetingDescription
}: CalendarExportProps) {
  const [showOptions, setShowOptions] = useState(false);

  const event: CalendarEvent = {
    title: meetingTitle,
    description: meetingDescription,
    startUTC: meetingOption.startUTC,
    endUTC: meetingOption.endUTC
  };

  const handleDownloadICS = () => {
    const icsContent = generateICS(event);
    downloadICS(icsContent, `${meetingTitle.replace(/\s+/g, '-').toLowerCase()}.ics`);
  };

  const urls = generateCalendarURLs(event);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {showOptions ? '캘린더 옵션 숨기기' : '캘린더에 추가'}
      </button>

      {showOptions && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">캘린더 선택:</h4>

          <button
            onClick={() => window.open(urls.google, '_blank')}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            구글 캘린더
          </button>

          <button
            onClick={handleDownloadICS}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            애플 캘린더 (.ics 파일)
          </button>
        </div>
      )}
    </div>
  );
}
