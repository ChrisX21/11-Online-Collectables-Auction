import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/loading-screen";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nautilux Auctions",
  description: "Your trusted platform for boat auctions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserrat.className} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
