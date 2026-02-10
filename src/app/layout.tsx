import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 1. 바깥쪽 배경 (데스크탑에서 보이는 영역) */}
        <div className="flex justify-center w-full min-h-screen bg-gray-100 text-gray-900">
          {/* 2. 모바일 뷰 컨테이너 (앱 화면 영역) */}
          <div className="w-full max-w-[480px] min-h-screen bg-white shadow-xl overflow-x-hidden">
            {/* 3. 실제 콘텐츠 */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
