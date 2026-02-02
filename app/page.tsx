"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { InteractiveMode } from "@/components/landing/interactive-mode"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">

      {/* Navbar - Sticky & Premium Dark (Matches Hero) */}
      <header className="fixed top-0 z-50 w-full bg-[#0B1120]/90 backdrop-blur-md border-b border-white/5">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
            <div className="bg-gradient-to-tr from-amber-400 to-amber-600 text-[#0B1120] p-2 rounded-xl shadow-lg shadow-amber-500/20">
              <ChefHat className="h-6 w-6" />
            </div>
            <span className="font-serif tracking-wide">MenüMaster</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link>
            <Link href="/login" className="hover:text-white transition-colors">Giriş Yap</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button className="bg-white hover:bg-slate-200 text-[#0B1120] rounded-full px-6 font-semibold transition-transform hover:scale-105 shadow-lg shadow-white/5 border border-transparent hover:border-white/20">
                Ücretsiz Dene
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />
        <InteractiveMode />
        <Pricing />
        <FAQ />
      </main>

      <footer className="py-12 border-t border-slate-900 bg-[#0B1120] text-slate-500">
        <div className="container text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <ChefHat size={20} className="text-white" />
            </div>
            <span className="font-serif font-bold text-white text-lg">MenüMaster</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 MenüMaster Hibrit Restoran Sistemleri. Tüm hakları saklıdır.</p>
          <div className="flex justify-center gap-6 mt-6 text-sm font-medium">
            <Link href="#" className="hover:text-indigo-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">İletişim</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
