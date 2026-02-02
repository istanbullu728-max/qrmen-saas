"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChefHat, QrCode, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white selection:bg-amber-500/30">

            {/* Dynamic Background Noise & Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 bg-repeat mix-blend-soft-light"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[5000ms]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center pt-20">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md text-amber-400 text-sm font-medium">
                        <Sparkles size={16} />
                        <span>Yapay Zeka Destekli Hibrit Sistem</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold font-serif leading-tight tracking-tight">
                        Menünüzü Sadece <br />
                        <span className="text-slate-400">Dijitalleştirmeyin,</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-lg">
                            Akıllı Hale Getirin.
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-400 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                        Türkiye'nin ilk hibrit sistemi: Yasal zorunluluk olan baskı menülerinizi saniyeler içinde tasarlayın, aynı anda canlı QR menünüzü ve garson çağırma sisteminizi devreye alın.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 rounded-full bg-slate-100 text-slate-900 hover:bg-white font-semibold text-lg transition-transform hover:scale-105">
                                Hemen Ücretsiz Deneyin
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-lg border border-slate-700 border-dashed">
                                Nasıl Çalışır?
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 box-shadow-green"></div>
                            2026 Yönetmeliğine Uygun
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            Kurulum Gerektirmez
                        </div>
                    </div>
                </motion.div>

                {/* Hero Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                    className="relative flex justify-center items-center"
                >
                    {/* Abstract Layout Representation */}
                    <div className="relative w-full max-w-md aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] border border-slate-700/50 shadow-2xl p-6 flex gap-4 backdrop-blur-xl group hover:rotate-1 transition-transform duration-500">

                        {/* Paper Menu Side */}
                        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 transform -rotate-2 origin-bottom-left transition-transform group-hover:-rotate-3 duration-500">
                            <div className="w-16 h-4 bg-slate-900 mb-4 rounded-sm"></div>
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                                <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                            </div>
                            <div className="mt-6 flex justify-between items-center bg-amber-50 rounded-lg p-2 border border-amber-100">
                                <div className="text-[10px] font-serif font-bold text-amber-900">CHEF'S SPECIAL</div>
                                <div className="text-[10px] font-bold text-amber-600">450₺</div>
                            </div>
                        </div>

                        {/* Digital Mobile Side */}
                        <div className="absolute -right-4 top-12 w-[180px] h-[340px] bg-slate-950 rounded-[2rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
                            <div className="absolute top-0 w-full h-6 bg-slate-800 z-20 flex justify-center"><div className="w-16 h-4 bg-slate-950 rounded-b-lg"></div></div>
                            <div className="w-full h-full bg-slate-900 p-3 pt-8 overflow-hidden relative">
                                {/* Floating QR */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-10"
                                >
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <QrCode className="text-slate-900 w-10 h-10" />
                                    </div>
                                    <div className="mt-3 bg-amber-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full">
                                        Tarat & Sipariş Ver
                                    </div>
                                </motion.div>

                                {/* Blurred Background UI */}
                                <div className="space-y-3 opacity-30 blur-[1px]">
                                    <div className="w-full h-24 bg-slate-800 rounded-xl"></div>
                                    <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
                                    <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                            <div className="bg-green-500 rounded-full p-2">
                                <ChefHat className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-white text-sm font-bold">Hibrit Sistem</div>
                                <div className="text-white/60 text-xs">Baskı + Dijital</div>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
