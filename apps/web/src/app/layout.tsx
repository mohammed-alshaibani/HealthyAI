import type { Metadata } from 'next';
import { Almarai, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const almarai = Almarai({ 
  subsets: ['arabic'],
  weight: ['400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
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
      <body className={`${almarai.variable} ${ibmPlex.variable} font-sans antialiased bg-white text-[#475569] min-h-screen flex flex-col selection:bg-[#0D9488]/20 selection:text-[#162836]`}>
        {children}
      </body>
    </html>
  );
}
