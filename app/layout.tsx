import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import {ThemeProvider} from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import ModelProvider from "@/components/providers/model-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discordo",
  description: "The real discord application :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en" suppressHydrationWarning>
          <body className={cn(font.className ,
              "bg-white dark:bg-[#313338]"
            )}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              storageKey="app-theme"
            >
              <ModelProvider/>

              {children}
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
