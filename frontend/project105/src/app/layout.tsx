import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "대전왔슈",
  description: "대전을 즐겁고, 맛있게 대전왔슈",
  openGraph: {
    title: "대전왔슈",
    description: "대전을 즐겁고, 맛있게 대전왔슈",
    url: "https://k11b105.p.ssafy.io", // 페이지 URL
    images: [
      {
        url: "/images/logo.jpg", // Open Graph 이미지
        width: 1200,
        height: 630,
        alt: "대전왔슈 이미지",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico", // 사이트 아이콘 (favicon)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <header>Header bar</header> */}
        {children}
      </body>
    </html>
  );
}
