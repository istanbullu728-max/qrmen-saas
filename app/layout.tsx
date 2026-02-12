import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Dancing_Script,
  Lato,
  Libre_Baskerville,
  Montserrat,
  DM_Sans,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-cormorant" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700"], variable: "--font-lato" });
const libre = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });

export const metadata: Metadata = {
  title: "MenüMaster QR Menü SaaS",
  description: "Profesyonel QR Menü ve Restoran Yönetim Sistemi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MenüMaster",
    startupImage: "/pwa-icon.png",
  },
  icons: {
    icon: "/pwa-icon.png",
    apple: "/pwa-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1120",
  viewportFit: "cover",
};

import { PWARegister } from "@/components/providers/pwa-register"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`
        ${inter.variable} ${playfair.variable} ${cormorant.variable} ${dancing.variable} ${lato.variable} ${libre.variable} ${montserrat.variable} ${dmSans.variable}
        font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Default to light for that clean SaaS look
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PWARegister />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
