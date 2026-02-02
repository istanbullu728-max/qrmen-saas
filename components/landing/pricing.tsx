"use client";

import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
    {
        name: "Başlangıç",
        id: "starter",
        href: "/register",
        price: "Ücretsiz",
        description: "Yasal uyumluluk ve temel dijitalleşme.",
        features: [
            "Akıllı Baskı Tasarım Aracı",
            "QR Menü (Sınırsız)",
            "30 Ürün Limiti",
            "SSL Güvenlik Sertifikası"
        ],
        featured: false,
    },
    {
        name: "Pro",
        id: "pro",
        href: "/register",
        price: "499₺",
        period: "/ay",
        description: "Tam operasyonel kontrol.",
        features: [
            "Tüm Başlangıç Özellikleri",
            "Sınırsız Ürün & Kategori",
            "Dijital Garson (Çağrı Sistemi)",
            "Yapay Zeka Upsell",
            "Çoklu Dil Desteği",
            "Kampanya Yönetimi"
        ],
        featured: true,
    },
];

export function Pricing() {
    return (
        <section className="py-24 bg-[#0B1120] relative" id="pricing">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full -z-10"></div>

            <div className="container px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-amber-500 uppercase tracking-widest">Fiyatlandırma</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
                        Basit, Şeffaf ve Adil.
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-400">
                        Gizli ücret yok. Taahhüt yok.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`flex flex-col justify-between rounded-3xl p-8 ring-1 ring-white/10 ${tier.featured ? 'bg-indigo-950/30 ring-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105 border border-indigo-500/30' : 'bg-slate-900/50 hover:bg-slate-900/80 transition-colors'
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3 id={tier.id} className={`text-lg font-semibold leading-8 ${tier.featured ? 'text-indigo-400' : 'text-white'}`}>
                                        {tier.name}
                                    </h3>
                                    {tier.featured && (
                                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-400">
                                            En Popüler
                                        </span>
                                    )}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-300">{tier.description}</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
                                    {tier.period && <span className="text-sm font-semibold leading-6 text-slate-400">{tier.period}</span>}
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-indigo-400" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                className={`mt-8 w-full rounded-full h-12 text-lg ${tier.featured ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-white/10 hover:bg-white/20'}`}
                                variant={tier.featured ? 'default' : 'secondary'}
                            >
                                {tier.id === 'starter' ? 'Ücretsiz Başla' : 'Pro Planı Seç'}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="rounded-full bg-slate-900/80 border border-slate-800 px-6 py-2 flex items-center gap-3 text-sm text-slate-400">
                        <Info size={16} className="text-amber-500" />
                        <span>2026 Restoran Yönetmeliği ile %100 uyumludur.</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
