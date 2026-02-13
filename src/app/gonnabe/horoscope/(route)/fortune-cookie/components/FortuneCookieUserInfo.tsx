'use client';

import UserInfoForm from '@/app/gonnabe/horoscope/(route)/theme/[theme]/components/UserInfoForm';
import { useRouter } from 'next/navigation';

export default function FortuneCookieUserInfo() {
  const router = useRouter();

  const handleSubmit = ({
    name,
    birthDate,
  }: {
    name: string;
    birthDate: string;
  }) => {
    const params = new URLSearchParams({ name, birthDate });
    router.push(`/gonnabe/horoscope/fortune-cookie?${params.toString()}`);
  };

  return <UserInfoForm onSubmit={handleSubmit} />;
}
