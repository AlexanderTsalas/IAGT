import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IntelliAgTech — Market Entry & Commercial Enablement",
  description:
    "Your operational gateway to Greece and Southeast Europe. Market entry, commercial representation, and operational execution for international companies.",
};
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SmoothScroll>
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
