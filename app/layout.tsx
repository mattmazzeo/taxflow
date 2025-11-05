import type { Metadata } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaxFlow - Tax Season Doesn't Have to Feel Like Tax Season",
  description: "Stay organized, feel confident, and stop worrying about missing tax forms. Trusted by families and CPAs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            classNames: {
              toast: "shadow-premium border-2",
              title: "font-semibold",
              description: "text-muted-foreground",
              success: "border-success bg-success/5 text-success-foreground",
              error: "border-destructive bg-destructive/5 text-destructive-foreground",
              warning: "border-warning bg-warning/5 text-warning-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
