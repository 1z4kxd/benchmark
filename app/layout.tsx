import type { Metadata } from 'next';
import Navbar from '@/components/Navigation/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'HumanBench', template: '%s | HumanBench' },
  description: 'Test your reaction time, memory, and cognition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
