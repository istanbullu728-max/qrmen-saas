"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Printer, Smartphone } from "lucide-react";

export function InteractiveMode() {
    const [mode, setMode] = useState<"print" | "digital">("print");

    return (
        <section className="py-32 bg-white overflow-hidden border-t border-slate-100">
            <div className="container text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">
                        Fizikselden Dijitale <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Akıcı Geçiş</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Müşterileriniz şık menünüze dokunsun veya QR ile dijital dünyaya adım atsın. Seçim sizin değil, her ikisi de.
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-center gap-6 p-2 bg-slate-50 border border-slate-200 rounded-full inline-flex mx-auto">
                    <div
                        onClick={() => setMode("print")}
                        className={`flex items-center gap-2 cursor-pointer transition-colors px-4 py-2 rounded-full ${mode === "print" ? "bg-white shadow-sm text-slate-900 font-bold border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Printer size={18} />
                        Baskı Modu
                    </div>

                    <div
                        onClick={() => setMode("digital")}
                        className={`flex items-center gap-2 cursor-pointer transition-colors px-4 py-2 rounded-full ${mode === "digital" ? "bg-white shadow-sm text-indigo-600 font-bold border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Smartphone size={18} />
                        Dijital Mod
                    </div>
                </div>

                {/* Interactive Stage */}
                <div className="relative h-[600px] w-full max-w-4xl mx-auto bg-slate-50 rounded-[3rem] border border-slate-200  flex items-center justify-center overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-50 -z-10"></div>

                    <AnimatePresence mode="wait">
                        {mode === "print" ? (
                            <motion.div
                                key="print"
                                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white text-slate-900 w-[300px] h-[440px] shadow-2xl rounded-sm p-8 flex flex-col relative z-20"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
                                    <h3 className="font-serif text-2xl font-bold tracking-widest">MENU</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Fine Dining Experience</p>
                                </div>
                                <div className="space-y-4 flex-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex justify-between items-baseline">
                                            <div className="text-left">
                                                <div className="font-bold text-sm font-serif">Signature  {i === 1 ? 'Steak' : i === 2 ? 'Risotto' : i === 3 ? 'Pasta' : 'Dessert'}</div>
                                                <div className="text-[10px] text-slate-500 italic">Seasonal ingredients, chef's choice</div>
                                            </div>
                                            <div className="text-sm font-bold ml-4 border-b border-dotted border-slate-300 flex-1 text-right">{120 + i * 40}₺</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center pt-4 border-t border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase">Fiyatlara KDV Dahildir</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="digital"
                                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                                transition={{ duration: 0.5 }}
                                className="bg-slate-900 w-[280px] h-[520px] rounded-[3rem] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden z-20"
                            >
                                <div className="absolute top-0 w-full h-6 bg-slate-800 z-30 flex justify-center"><div className="w-20 h-4 bg-slate-900 rounded-b-lg"></div></div>
                                <div className="p-4 pt-10 text-left space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-bold text-xl">Merhaba 👋</h3>
                                        <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                    </div>

                                    {/* Categories */}
                                    <div className="flex gap-2 overflow-hidden">
                                        {['Popüler', 'Ana Yemek', 'İçecek'].map(cat => (
                                            <span key={cat} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap">{cat}</span>
                                        ))}
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {[1, 2].map(i => (
                                            <div key={i} className="bg-slate-900 p-3 rounded-2xl flex gap-3">
                                                <div className="w-16 h-16 bg-slate-800 rounded-xl"></div>
                                                <div className="flex-1">
                                                    <div className="text-white text-sm font-bold">Dana Kaburga</div>
                                                    <div className="text-slate-500 text-[10px] mt-1">Ağır ateşte pişmiş...</div>
                                                    <div className="text-amber-500 text-xs font-bold mt-2">450₺</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Call Waiter */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-indigo-600 text-white p-3 rounded-xl text-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                                        Garson Çağır 🔔
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
