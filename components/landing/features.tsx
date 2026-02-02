"use client";

import { motion } from "framer-motion";
import {
    Palette,
    QrCode,
    BellRing,
    Megaphone,
    ArrowUpRight,
    Smartphone,
    Printer
} from "lucide-react";

const features = [
    {
        title: "Akıllı Tasarım Motoru",
        description: "Canva ile uğraşmayın. Verinizi girin, iMenuPro zekasıyla baskı menünüz saniyeler içinde hazır olsun.",
        icon: Palette,
        color: "bg-purple-500",
        colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
        image: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Canlı QR Sistem",
        description: "Fiyat değişince baskı değiştirmeyin. Panelden güncelleyin, her yer anında güncellensin.",
        icon: QrCode,
        color: "bg-amber-500",
        colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        isDark: true
    },
    {
        title: "Dijital Garson",
        description: "Müşterileriniz tek tıkla garson çağırsın veya hesap istesin. Operasyonunuzu hızlandırın.",
        icon: BellRing,
        color: "bg-rose-500",
        colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
        isDark: true
    },
    {
        title: "Kampanya Yönetimi",
        description: "Müşterilerinizin telefonuna özel pop-up kampanyalar ve indirimler çıkarın.",
        icon: Megaphone,
        color: "bg-indigo-500",
        colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop"
    }
];

export function Features() {
    return (
        <section className="py-32 bg-slate-950 text-slate-100" id="features">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold">
                        Tek Bir Platform. <br />
                        <span className="text-amber-500">Sınırsız Olanak.</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        İşletmenizi modern çağa taşıyacak tüm araçlar elinizin altında.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition-colors p-8 flex flex-col justify-between ${feature.colSpan}`}
                        >
                            {/* Background Gradients */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity`}></div>

                            {feature.image && (
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            )}

                            <div className="relative z-10 flex justify-between items-start">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color} text-white shadow-lg`}>
                                    <feature.icon size={24} />
                                </div>
                                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
                            </div>

                            <div className="relative z-10 space-y-2">
                                <h3 className="text-2xl font-bold font-serif">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-light">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
