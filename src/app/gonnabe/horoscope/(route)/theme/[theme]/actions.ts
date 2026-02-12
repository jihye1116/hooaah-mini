'use server';

import { redirect } from 'next/navigation';

const normalizeBirthday = (input: string) => {
  const trimmed = input.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const korean = trimmed.match(
    /^(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일$/,
  );
  if (korean) {
    const [, y, m, d] = korean;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const dotted = trimmed.match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})$/);
  if (dotted) {
    const [, y, m, d] = dotted;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return trimmed;
};

export async function submitHoroscopeUserInfo(
  theme: string,
  formData: FormData,
) {
  const name = String(formData.get('name') ?? '').trim();
  const birthDateRaw = String(formData.get('birthDate') ?? '').trim();
  const birthDate = normalizeBirthday(birthDateRaw);

  if (!name || !birthDate) {
    redirect(`/gonnabe/horoscope/${encodeURIComponent(theme)}`);
  }

  const params = new URLSearchParams({ name, birthDate });
  redirect(
    `/gonnabe/horoscope/${encodeURIComponent(theme)}?${params.toString()}`,
  );
}
