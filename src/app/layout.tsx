import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '후아 미니',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {/* 1. 바깥쪽 배경 (데스크탑에서 보이는 영역) */}
        <div className="flex min-h-screen w-full justify-center bg-gray-100 text-gray-900">
          {/* 2. 모바일 뷰 컨테이너 (앱 화면 영역) */}
          <div className="min-h-screen w-full max-w-120 overflow-x-hidden bg-white shadow-xl">
            {/* 3. 실제 콘텐츠 */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
