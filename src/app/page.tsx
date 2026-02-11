'use client';

import React, { useState } from 'react';
import LoadingOverlay from './songil/components/LoadingOverlay';

export default function LoadingTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  const startLoading = () => {
    setIsLoading(true);
    addLog('🚀 로딩 시작! (30초 카운트다운)');

    // 30초 후에 로딩을 끝내는 시뮬레이션
    // (실제 앱에서는 데이터 처리가 끝나면 setIsLoading(false)를 하시면 됩니다)
    setTimeout(() => {
      setIsLoading(false);
      addLog('✅ 30초 경과: 로딩 종료 (자동 닫힘)');
    }, 30000); // 30000ms = 30초
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-10">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          로딩 오버레이 테스트
        </h1>
        <p className="mb-6 text-gray-600">
          버튼을 누르면 30초 동안 로띠 애니메이션이
          <br />
          아주 천천히(강제 프레임 제어) 재생됩니다.
        </p>

        <div className="flex justify-center gap-2">
          <button
            onClick={startLoading}
            disabled={isLoading}
            className={`rounded-lg px-6 py-3 font-semibold text-white transition-all ${
              isLoading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isLoading ? '로딩 중...' : '30초 로딩 시작'}
          </button>

          {/* 비상 탈출 버튼 */}
          {isLoading && (
            <button
              onClick={() => {
                setIsLoading(false);
                addLog('🛑 강제 중단됨');
              }}
              className="rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-500 hover:bg-red-50"
            >
              중단
            </button>
          )}
        </div>
      </div>

      {/* 로그 확인용 창 */}
      <div className="h-48 w-full max-w-md overflow-y-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
        <div className="mb-2 border-b border-gray-700 pb-2 font-bold">Logs</div>
        {logs.length === 0 ? (
          <span className="text-gray-500">대기 중...</span>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>

      {/* 여기에 로딩 컴포넌트 배치 */}
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}
