'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState('친구 모임');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(60);
  const [creating, setCreating] = useState(false);

  const handleCreateMeeting = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meetingTitle,
          description: meetingDescription,
          duration: meetingDuration
        })
      });

      if (!response.ok) throw new Error('모임 생성 실패');

      const data = await response.json();
      router.push(`/meeting/${data.meetingId}`);
    } catch (error) {
      alert('모임 생성에 실패했습니다');
      setCreating(false);
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">새 모임 만들기</h2>
          <p className="text-gray-600 mb-6">
            모임을 만들고 친구들에게 링크를 공유하세요. 각자 자신의 가능한 시간을 추가하면 최적의 회의 시간을 찾아드립니다.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                모임 제목
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="예: 주말 모임"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                설명 (선택사항)
              </label>
              <textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                rows={3}
                placeholder="모임에 대한 추가 정보..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                예상 소요 시간
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

            <button
              onClick={handleCreateMeeting}
              disabled={creating}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {creating ? '생성 중...' : '모임 만들고 링크 받기'}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">사용 방법</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>모임 생성:</strong> 위에서 모임 제목과 정보를 입력하고 "모임 만들기"를 클릭하세요
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>링크 공유:</strong> 생성된 링크를 카카오톡, 문자, 이메일 등으로 친구들에게 공유하세요
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>각자 입력:</strong> 각 친구가 링크를 열어 본인을 선택/추가하고 가능한 날짜와 시간을 입력합니다
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                <strong>최적 시간 확인:</strong> "최적 시간 찾기"를 클릭하면 모두가 가능한 시간대를 자동으로 찾아줍니다
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                5
              </span>
              <span>
                <strong>캘린더 추가:</strong> 결정된 시간을 구글 캘린더, 애플 캘린더 등에 바로 추가할 수 있습니다
              </span>
            </li>
          </ol>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">주요 기능</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>자동 시간대 변환 - 서울, 뉴욕, LA 등 어디서든 쉽게 조율</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>각자의 기기에서 입력 - 링크만 공유하면 각자 추가 가능</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>특정 날짜 선택 - 요일이 아닌 정확한 날짜로 입력</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>로그인 불필요 - 복잡한 가입 절차 없이 바로 사용</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>원클릭 캘린더 연동 - 구글, 애플, 아웃룩 캘린더 지원</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
