import type { Metadata } from 'next';
import { Quicksand, Fredoka } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-primary'
});

const fredoka = Fredoka({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading'
});

export const metadata: Metadata = {
  title: 'Curious Bob - AI Repository Analysis',
  description: 'Analyze GitHub repositories and generate actionable engineering tickets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quicksand.variable} ${fredoka.variable}`}>
      <body className={quicksand.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}