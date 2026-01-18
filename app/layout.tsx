import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./components/ErrorBoundary";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://app.vaulto.ai'),
  title: {
    default: "Vaulto",
    template: "%s | Vaulto"
  },
  description: "Trade tokenized equities with stablecoins. Advanced DeFi infrastructure with MEV protection and institutional-grade security.",
  keywords: [
    "tokenized stocks",
    "DeFi trading",
    "stablecoin swap",
    "crypto trading",
    "tokenized securities",
    "TSLA token",
    "AAPL token",
    "stock tokens",
    "decentralized exchange",
    "private investing",
    "blockchain trading",
    "Web3 finance"
  ],
  authors: [{ name: "Vaulto" }],
  creator: "Vaulto",
  publisher: "Vaulto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.vaulto.ai",
    title: "Vaulto",
    description: "Trade tokenized equities with stablecoins. Advanced DeFi infrastructure with MEV protection and institutional-grade security.",
    siteName: "Vaulto",
    images: [
      {
        url: "/promotional.png",
        width: 1200,
        height: 630,
        alt: "Vaulto Swap - Trade Tokenized Stocks with Stablecoins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaulto",
    description: "Trade tokenized equities with stablecoins. Advanced DeFi infrastructure with MEV protection and institutional-grade security.",
    creator: "@vaultoai",
    site: "@vaultoai",
    images: ["/promotional.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vaulto",
    "url": "https://app.vaulto.ai",
    "description": "Trade tokenized equities with stablecoins. Advanced DeFi infrastructure with MEV protection and institutional-grade security.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "Vaulto",
      "url": "https://vaulto.ai",
      "logo": "https://app.vaulto.ai/favicon.png",
      "sameAs": [
        "https://twitter.com/vaultoai",
        "https://instagram.com/vaultoai",
        "https://linkedin.com/company/vaulto",
        "https://youtube.com/@vaultoai"
      ]
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script src="https://plugin.jup.ag/plugin-v1.js" data-preload defer></script>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y8W2H3EQJD"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y8W2H3EQJD');
          `}
        </Script>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

