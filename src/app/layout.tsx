import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Quizme",
  description: "Platform to give quizzes",
};
import { Toaster } from "@/components/ui/toaster";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-10")}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
