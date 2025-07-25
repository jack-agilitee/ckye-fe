import type { Metadata } from "next";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { UserProvider } from "@/context/UserContext";
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
          <UserProvider>
            {children}
          </UserProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
