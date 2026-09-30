import type { Metadata } from 'next';
import { Inter, Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kufi'
});

export const metadata: Metadata = {
  title: 'HealTrip AI',
  description: 'AI Patient Decision Assistant for finding doctors and hospitals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Default to en/ltr but this gets overridden by ChatWindow's 'dir' attribute dynamically
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoKufi.variable} antialiased selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900/50 dark:selection:text-blue-100`}>
        {children}
      </body>
    </html>
  );
}
