import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TickerBanner } from '@/components/layout/TickerBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCartDock } from '@/components/cart/FloatingCartDock';
import { QuickViewModal } from '@/components/shop/QuickViewModal';
import { BatumiCheckoutModal } from '@/components/checkout/BatumiCheckoutModal';

export const metadata: Metadata = {
  title: 'LAMAZAD.GE | ლამაზად — ტანსაცმელი და ფეხსაცმელი ბათუმში',
  description:
    'ექსკლუზიური ფეხსაცმელი, ჰუდები, მაისურები და ონლაინ Design Lab ბათუმში. 24 საათიანი ექსპრეს მიტანა მთელ ბათუმში.',
  keywords: [
    'lamazad.ge',
    'ლამაზად',
    'ბათუმი ტანსაცმელი',
    'ბათუმი ფეხსაცმელი',
    'ონლაინ მაღაზია ბათუმი',
    'design lab batumi',
  ],
  authors: [{ name: 'Lamazad Batumi' }],
  metadataBase: new URL('https://lamazad.ge'),
  openGraph: {
    title: 'LAMAZAD.GE | ლამაზად — ბათუმი',
    description: 'მზა ფეხსაცმელი, ტანსაცმელი და ონლაინ Design Lab. მიტანა ბათუმში 24 საათში.',
    url: 'https://lamazad.ge',
    siteName: 'LAMAZAD.GE',
    locale: 'ka_GE',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Georgian:wght@300;400;600;700;800;900&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-brand-white min-h-screen flex flex-col antialiased selection:bg-brand-lime selection:text-black">
        {/* Top Promotional Ticker */}
        <TickerBanner />

        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Viewport */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <FloatingCartDock />
        <QuickViewModal />
        <BatumiCheckoutModal />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
