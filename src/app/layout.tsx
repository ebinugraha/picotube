import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import { TRPCProvider, TRPCReactProvider } from "@/trpc/client";

export const metadata: Metadata = {
  title: "Pico Tube",
  description: "A simple video sharing platform",
};

const nunito = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
