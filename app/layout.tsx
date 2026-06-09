import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk , Space_Mono, Poppins } from "next/font/google";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
});

const geistMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "Get your link",
  description: "Made by Harshit.page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${space.variable}  ${space.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
