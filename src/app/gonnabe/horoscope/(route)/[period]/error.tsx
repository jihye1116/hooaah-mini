'use client';

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-2 text-xl font-semibold">문제가 발생했습니다</h2>
        <p className="mb-4 text-sm text-[#666666]">
          {error?.message ?? '알 수 없는 오류'}
        </p>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => reset()}
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
