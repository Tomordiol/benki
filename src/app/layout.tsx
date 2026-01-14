
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { getArticles, getSettings } from '@/lib/article-actions';
import { LanguageProvider } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle'; // Need to create this

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BenkiTv - The Fire of Truth',
  description: 'Latest news in English and Kannada',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles: any[] = await getArticles();
  const settings = await getSettings();

  const breakingNews = articles
    .filter((a) => a.is_breaking)
    .map((a) => `${a.title_en} | ${a.title_kn}`);

  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar adBannerUrl={settings.ad_banner_url} />
          <Ticker news={breakingNews} />

          {/* Floating Toggle or Header Toggle - placing floating for visibility */}
          <LanguageToggle />

          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
