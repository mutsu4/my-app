
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUTSUKI STORE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full border-b border-stone-100 bg-white">
          <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
            <Link
              href="/"
              className="font-serif text-3xl tracking-tight"
            >
              MUTSUKI STORE
            </Link>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
