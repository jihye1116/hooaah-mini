import { useParams } from 'next/navigation';

export default function HoroscopeThemePage() {
  const { theme } = useParams();

  return <h1>Horoscope Theme Page: {theme}</h1>;
}
