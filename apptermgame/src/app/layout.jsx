import { Prompt } from "next/font/google";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./globals.css";
import { Providers } from "./providers";

const font = Prompt({ subsets: ["thai"], weight: '400' });


export async function generateMetadata() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API}/setting`, { cache: 'no-store' }).then(response => response.json())
  return {
    title: data?.title,
    description: data?.desc,
    keywords: data?.keyword?.split(','),
    publisher: 'RU6SU6.DEV',
    icons: {
      icon: { url: data?.fav },
      shortcut: data?.fav,
      apple: data?.fav,
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: data?.fav,
      },
    },
    openGraph: {
      title: data?.title,
      description: data?.desc,
      siteName: data?.title,
      images: [
        {
          url: data?.fav,
        }
      ],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: data?.fav,
      title: data?.title,
      description: data?.desc,
      creator: 'RU6SU6',
      images: data?.fav,
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
