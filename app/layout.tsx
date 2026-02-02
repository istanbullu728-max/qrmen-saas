import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Dancing_Script,
  Lato,
  Libre_Baskerville,
  Montserrat,
  Cinzel,
  Amatic_SC,
  Oswald,
  Crimson_Text,
  Quicksand,
  Raleway,
  Nunito,
  Merriweather,
  Abril_Fatface,
  Bebas_Neue,
  Great_Vibes,
  DM_Sans,
  Space_Mono
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-cormorant" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700"], variable: "--font-lato" });
const libre = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

// New Premium Fonts
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const amatic = Amatic_SC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-amatic" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const crimson = Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-crimson" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-merriweather" });
const abril = Abril_Fatface({ subsets: ["latin"], weight: ["400"], variable: "--font-abril" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-great-vibes" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "QR Menu SaaS",
  description: "Modern QR Menu Platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`
        ${inter.variable} ${playfair.variable} ${cormorant.variable} ${dancing.variable} ${lato.variable} ${libre.variable} ${montserrat.variable}
        ${cinzel.variable} ${amatic.variable} ${oswald.variable} ${crimson.variable} ${quicksand.variable} ${raleway.variable}
        ${nunito.variable} ${merriweather.variable} ${abril.variable} ${bebas.variable} ${greatVibes.variable} ${dmSans.variable} ${spaceMono.variable}
        font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Default to light for that clean SaaS look
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
