'use client';

import { useState } from 'react';

interface UserInfoFormProps {
  onSubmit: (data: { name: string; birthDate: string }) => void;
}

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthDate) {
      onSubmit({ name, birthDate });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value; // "YYYY-MM-DD" 형태로 들어옴

    // 값이 완전히 지워졌을 때 처리
    if (!inputValue) {
      setBirthDate('');
      return;
    }

    // '-' 기준으로 연도 부분만 분리
    const year = inputValue.split('-')[0];

    // 연도가 4자리를 초과하면 상태를 업데이트하지 않고 무시함
    if (year.length > 4) {
      return;
    }

    setBirthDate(inputValue);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-[#333333]">
          운세 보기
        </h1>
        <p className="mb-8 text-center text-[#666666]">
          정확한 운세를 위해 정보를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-[#333333]"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="rounded-xl border border-[#E0E0E0] px-4 py-3 transition-colors outline-none focus:border-[#333333]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="birthDate"
              className="text-sm font-semibold text-[#333333]"
            >
              생년월일
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={handleDateChange} // 수정한 핸들러 적용
              max={new Date().toISOString().split('T')[0]} // 달력 팝업용 제한
              className="rounded-xl border border-[#E0E0E0] px-4 py-3 transition-colors outline-none focus:border-[#333333]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name || !birthDate}
            className="mt-4 rounded-xl bg-[#333333] px-6 py-4 font-semibold text-white transition-opacity disabled:opacity-50"
          >
            운세 확인하기
          </button>
        </form>
      </div>
    </div>
  );
}
