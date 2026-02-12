'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
            return;
        }

        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after a short delay for better UX
            setTimeout(() => setIsVisible(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For iOS, show the custom guide
        if (isIosDevice && !isStandalone) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [isStandalone]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (isStandalone || !isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="w-full max-w-sm pointer-events-auto"
                >
                    <div className="bg-[#0B1120] text-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl relative overflow-hidden">
                        {/* Premium Gradient Decoration */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 blur-[80px]"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px]"></div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 mb-4 rotate-3 mt-2">
                                <ChefHatIcon className="h-8 w-8 text-[#0B1120]" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">MenüMaster'ı Yükle</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                {isIOS
                                    ? "Uygulamayı mobil app gibi kullanmak için tarayıcı menüsünden 'Ana Ekrana Ekle' butonuna basınız."
                                    : "MenüMaster'ı telefonunuza indirerek native uygulama deneyimi yaşayın ve siparişleri anında yönetin."}
                            </p>

                            {isIOS ? (
                                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 rounded-2xl border border-white/5 text-amber-400 font-medium text-sm">
                                    <Share size={18} />
                                    <span>Paylaş &gt; Ana Ekrana Ekle</span>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleInstallClick}
                                    className="w-full bg-white hover:bg-slate-200 text-[#0B1120] rounded-2xl font-bold py-6 text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Download size={22} />
                                    Uygulamayı İndir
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Backdrop overlay for focus */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsVisible(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10 pointer-events-auto sm:hidden"
                />
            </div>
        </AnimatePresence>
    );
}

function ChefHatIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 13.8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9.8" />
            <path d="M6 13c-2 0-3 1-3 3s1 3 3 3h12c2 0 3-1 3-3s-1-3-3-3" />
            <path d="M9 22h6" />
        </svg>
    );
}
