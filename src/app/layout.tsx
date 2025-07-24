import type { Metadata } from "next";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Ckye",
  description: "Ckye Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
