import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ 
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HealTrip AI',
  description: 'AI Patient Decision Assistant for finding doctors and hospitals in Saudi Arabia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${cairo.variable} font-sans antialiased selection:bg-[#0D9488]/20 selection:text-[#162836] bg-[#F8FAFC] text-[#162836] min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
