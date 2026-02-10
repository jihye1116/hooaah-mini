'use client';

const BottomFloating = () => (
  <div className="fixed bottom-0  bg-white  p-4 pb-8 w-full max-w-[480px]">
    {/* BottomFloating 컴포넌트 자리 */}
    <div className="flex gap-3">
      <button className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold">
        공유하기
      </button>
      <button className="flex-1 bg-[#F97B68] text-white py-4 rounded-xl font-bold">
        저장하기
      </button>
    </div>
  </div>
);

export default BottomFloating;
