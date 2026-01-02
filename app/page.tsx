'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState('신년 만담회');
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
      alert('모임 생성에 실패했습니다 - 송예은에게 알려주세요...');
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">류김송의 만남 스케줄러</h1>
          <p className="mt-1 text-sm text-gray-600">
            송예은이 시차 계산 화딱지 나서 만든 웹사이트
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">함 만나볼까요</h2>
          <p className="text-gray-600 mb-6">
            만남을 주최하고 싶다면! 모임을 만들고 친구들에게 링크를 공유하세요. 각자 가능한 시간을 추가하면 최적의 미팅 시간을 찾아드립니다~
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
                placeholder="예: 신년 만담회"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                추가설명 (선택사항)
              </label>
              <textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                rows={3}
                placeholder="만나서 뭘 할건가요??"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                예상 소요 시간 (대충))
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
                <option value={150}>2시간+ ...</option>
              </select>
            </div>

            <button
              onClick={handleCreateMeeting}
              disabled={creating}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {creating ? '생성 중...' : '계획을 시작해볼까요..'}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">어케 쓰는 거고!!</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>모임 생성:</strong> 위에서 모임 제목과 설명 입력하고 버튼 클릭 ㄱ
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>링크 공유:</strong> 그럼 링크 만들어질거거든? 그거 공유 ㄱ
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>되는 시간 입력:</strong> 각자 링크를 열어서 본인을 선택/추가한 다음에 가능한 날짜 & 시간 입력 ㄱ
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                <strong>모임 시간 확인:</strong> "우리는 언제 만날 수 있냐면..."을 클릭하면 셋 다 가능한 시간대 자동으로 찾아줌
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                5
              </span>
              <span>
                <strong>캘린더 추가:</strong> 인간은 망각의 동물이기 때문에... 구글 캘린더, 애플 캘린더 등에 바로 추가할 수도 있음!
              </span>
            </li>
          </ol>
        </div>

      </main>
    </div>
  );
}
